import json
from django.views.generic import View
from django.db.models import F
from libs import json_response, JsonParser, Argument
from apps.setting.utils import AppSetting
from apps.host.models import Host
from apps.app.models import Deploy
from apps.config.models import Credential
from apps.schedule.models import Task
from apps.monitor.models import Detection
from apps.account.models import Role
from libs.ssh import SSH, AuthenticationException
from paramiko.ssh_exception import BadAuthenticationType
from libs import human_datetime, AttrDict
from openpyxl import load_workbook
import socket


class HostView(View):
    def get(self, request):
        host_id = request.GET.get('id')
        if host_id:
            if not request.user.has_host_perm(host_id):
                return json_response(error='无权访问该主机，请联系管理员')
            return json_response(Host.objects.filter(pk=host_id).first())
        hosts = Host.objects.filter(deleted_by_id__isnull=True)
        zones = [x['zone'] for x in hosts.order_by('zone').values('zone').distinct()]
        perms = [x.id for x in hosts] if request.user.is_supper else request.user.host_perms
        return json_response({'zones': zones, 'hosts': [x.to_dict() for x in hosts], 'perms': perms})

    def post(self, request):
        form, error = JsonParser(
            Argument('id', type=int, required=False),
            Argument('zone', help='请输入主机类型'),
            Argument('name', help='请输主机名称'),
            Argument('username', handler=str.strip, help='请输入登录用户名'),
            Argument('hostname', handler=str.strip, help='请输入主机名或IP'),
            Argument('port', type=int, help='请输入SSH端口'),
            Argument('desc', required=False),
            Argument('password',  type=dict, required=False),
        ).parse(request.body)
        if error is None:
            param_pwd = form.pop('password')
            passwd = None
            cred = None
            if param_pwd is not None:
                if param_pwd.get("name") is not None:
                    cred = Credential.objects.filter(name=param_pwd['name']).first()
                    if cred is not None:
                        passwd = cred.password
                        form.access_credentials = cred.name
                elif param_pwd.get('password') is not None:
                    passwd = param_pwd.get('password')
            if passwd is None:
                return json_response('Password is required')
            elif valid_ssh(form.hostname, form.port, form.username, passwd) is False:
                return json_response('auth fail')

            if cred is not None:
                if cred.password != passwd:
                    cred.password = passwd
                    cred.save()
            else:
                name = f'{form.username}@{form.hostname}'
                cred1 = Credential.objects.filter(name=name).first()
                if cred1 is None:
                    Credential.objects.create(created_by=request.user, name=name, password=passwd, desc=f'【{form.name}】的访问凭证')
                form.access_credentials = name
            if form.id:
                Host.objects.filter(pk=form.pop('id')).update(**form)
            elif Host.objects.filter(name=form.name, deleted_by_id__isnull=True).exists():
                return json_response(error=f'已存在的主机名称【{form.name}】')
            else:
                host = Host.objects.create(created_by=request.user, **form)
                if request.user.role:
                    request.user.role.add_host_perm(host.id)
        return json_response(error=error)

    def patch(self, request):
        form, error = JsonParser(
            Argument('id', type=int, required=False),
            Argument('zone', help='请输入主机类别')
        ).parse(request.body)
        if error is None:
            host = Host.objects.filter(pk=form.id).first()
            if not host:
                return json_response(error='未找到指定主机')
            count = Host.objects.filter(zone=host.zone, deleted_by_id__isnull=True).update(zone=form.zone)
            return json_response(count)
        return json_response(error=error)

    def delete(self, request):
        form, error = JsonParser(
            Argument('id', type=int, help='请指定操作对象')
        ).parse(request.GET)
        if error is None:
            deploy = Deploy.objects.filter(host_ids__regex=fr'\D{form.id}\D').annotate(
                app_name=F('app__name'),
                env_name=F('env__name')
            ).first()
            if deploy:
                return json_response(error=f'应用【{deploy.app_name}】在【{deploy.env_name}】的发布配置关联了该主机，请解除关联后再尝试删除该主机')
            task = Task.objects.filter(targets__regex=fr'\D{form.id}\D').first()
            if task:
                return json_response(error=f'任务计划中的任务【{task.name}】关联了该主机，请解除关联后再尝试删除该主机')
            detection = Detection.objects.filter(type__in=('3', '4'), addr=form.id).first()
            if detection:
                return json_response(error=f'监控中心的任务【{detection.name}】关联了该主机，请解除关联后再尝试删除该主机')
            role = Role.objects.filter(host_perms__regex=fr'\D{form.id}\D').first()
            if role:
                return json_response(error=f'角色【{role.name}】的主机权限关联了该主机，请解除关联后再尝试删除该主机')
            Host.objects.filter(pk=form.id).update(
                deleted_at=human_datetime(),
                deleted_by=request.user,
            )
        return json_response(error=error)


def post_import(request):
    password = request.POST.get('password')
    file = request.FILES['file']
    ws = load_workbook(file, read_only=True)['Sheet1']
    summary = {'invalid': [], 'skip': [], 'fail': [], 'network': [], 'repeat': [], 'success': [], 'error': []}
    for i, row in enumerate(ws.rows):
        if i == 0:  # 第1行是表头 略过
            continue
        if not all([row[x].value for x in range(5)]):
            summary['invalid'].append(i)
            continue
        data = AttrDict(
            zone=row[0].value,
            name=row[1].value,
            hostname=row[2].value,
            port=row[3].value,
            username=row[4].value,
            password=row[5].value,
            desc=row[6].value
        )
        if Host.objects.filter(hostname=data.hostname, port=data.port, username=data.username,
                               deleted_by_id__isnull=True).exists():
            summary['skip'].append(i)
            continue
        try:
            if valid_ssh(data.hostname, data.port, data.username, data.pop('password') or password, False) is False:
                summary['fail'].append(i)
                continue
        except AuthenticationException:
            summary['fail'].append(i)
            continue
        except socket.error:
            summary['network'].append(i)
            continue
        except Exception:
            summary['error'].append(i)
            continue
        if Host.objects.filter(name=data.name, deleted_by_id__isnull=True).exists():
            summary['repeat'].append(i)
            continue
        host = Host.objects.create(created_by=request.user, **data)
        if request.user.role:
            request.user.role.add_host_perm(host.id)
        summary['success'].append(i)
    return json_response(summary)


def valid_ssh(hostname, port, username, password, with_expect=True):
    cli = SSH(hostname, port=port, username=username, password=password)
    # print(hostname, port, username, password)
    try:
        cli.ping()
    except BadAuthenticationType:
        if with_expect:
            raise TypeError('该主机不支持密钥认证，错误代码：E01')
        return False
    except AuthenticationException:
        if password and with_expect:
            raise ValueError('密钥认证失败，错误代码：E02')
        return False
    return True
