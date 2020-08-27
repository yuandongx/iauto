import os
from shutil import move
from django.views.generic import View
from libs import json_response, JsonParser, Argument, human_datetime
from libs.channel import Channel
from apps.exec.models import ExecTemplate
from apps.host.models import Host
from django.conf import settings

class TemplateView(View):
    def get(self, request):
        templates = ExecTemplate.objects.all()
        types = [x['type'] for x in templates.order_by('type').values('type').distinct()]
        return json_response({'types': types, 'templates': [x.to_dict() for x in templates]})

    def post(self, request):
        form, error = JsonParser(
            Argument('id', type=int, required=False),
            Argument('name', help='请输入模版名称'),
            Argument('type', help='请选择模版类型'),
            Argument('body', help='请输入模版内容'),
            Argument('desc', required=False)
        ).parse(request.body)
        if error is None:
            if form.id:
                form.updated_at = human_datetime()
                form.updated_by = request.user
                ExecTemplate.objects.filter(pk=form.pop('id')).update(**form)
            else:
                form.created_by = request.user
                ExecTemplate.objects.create(**form)
        return json_response(error=error)

    def delete(self, request):
        form, error = JsonParser(
            Argument('id', type=int, help='请指定操作对象')
        ).parse(request.GET)
        if error is None:
            ExecTemplate.objects.filter(pk=form.id).delete()
        return json_response(error=error)


def do_task(request):
    form, error = JsonParser(
        Argument('host_ids', type=list, filter=lambda x: len(x), help='请选择执行主机'),
        Argument('command', help='请输入执行命令内容')
    ).parse(request.body)
    if error is None:
        if not request.user.has_host_perm(form.host_ids):
            return json_response(error='无权访问主机，请联系管理员')
        token = Channel.get_token()
        for host in Host.objects.filter(id__in=form.host_ids):
            Channel.send_ssh_executor(
                token=token,
                hostname=host.hostname,
                port=host.port,
                username=host.username,
                command=form.command
            )
        return json_response(token)
    return json_response(error=error)


def handle_uploaded_file(f):
    # print(dir(f))
    tmp_path = os.path.join(settings.REPOS_DIR, "tmp.abc.123.XZY")
    if not os.path.exists(tmp_path):
        os.mkdir(tmp_path)
    with open(os.path.join(tmp_path, f.name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def upload_file(request):
    if request.method == 'POST':
        handle_uploaded_file(request.FILES['file'])
    return json_response(data={"msg": "ok"})


def upload_submit(request):
    ok = []
    override = []
    fail = []
    repeat = False
    tmp_path = os.path.join(settings.REPOS_DIR, "tmp.abc.123.XZY")
    templates_path = os.path.join(settings.REPOS_DIR, "templates")
    if not os.path.exists(templates_path):
        os.mkdir(templates_path)
    if request.method == "POST":
        files_name = request.POST.get('files')
        names = files_name.split(',')
        for name in names:
            repeat = False
            ttype = 'shell' if name.split('.')[-1] == 'sh' else 'ansible-playbook'
            row = {'name': name, 'type': ttype}
            try:
                if os.path.exists(os.path.join(templates_path, name)):
                    os.remove(os.path.join(templates_path, name))
                    repeat = True
                move(os.path.join(tmp_path, name), templates_path)
            except:
                fail.append(name)
            else:
                try:
                    with open(os.path.join(templates_path, name), 'r') as f:
                        row['body'] = f.read()
                except:
                    row['body'] = os.path.join(templates_path, name)

                if repeat:
                    override.append(name)
                else:
                    ok.append(name)
            row['created_by'] = request.user
            ExecTemplate.objects.create(**row)
    return json_response(dict(ok=ok, fail=fail, override=override))


def run_ansible(request):
    pass
