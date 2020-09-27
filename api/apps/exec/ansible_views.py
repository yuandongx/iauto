import json
from functools import partial
from django_redis import get_redis_connection
from django.conf import settings
from apps.host.models import Host
from django.views.generic import View
from libs import json_response, JsonParser, Argument, human_datetime
from .tasks import run_ansible
from apps.exec.models import Task, History
from apps.template.models import Template
from libs import Runner
from threading import Thread


class ShowAnsibleview(View):
    def get(self, request):
        tasks = Task.objects.filter(is_active=True).all()
        historys = {}
        for x in History.objects.all():
            d = x.to_dict()
            historys[d["celery_id"]] = d
        types = [x['type'] for x in tasks.order_by('type').values('type').distinct()]
        new_tasks = []
        for x in tasks:
            d = x.to_dict()
            tmpid = json.loads(d['playbooks'])
            tmps = Template.objects.filter(id__in=tmpid)
            d['playbooks'] = [{"name": t.name, "id": t.id} for t in tmps]
            state = History.objects.filter(task_id=d["id"]).first()
            if state:
                d["status"] = state.status
            new_tasks.append(d)

        return json_response({'types': types, 'tasks': new_tasks})

    def post(self, request):
        form, error = JsonParser(
            Argument('id', type=int, required=False),
            Argument('type', help='请输入任务类型'),
            Argument('name', help='请输入任务名称'),
            Argument('playbooks', help='请输入任务内容'),
            Argument('rst_notify', type=dict, help='请选择执行失败通知方式'),
            Argument('targets', type=list, filter=lambda x: len(x), help='请选择执行对象'),
            # Argument('trigger', filter=lambda x: x in dict(Task.TRIGGERS), help='请选择触发器类型'),
            # Argument('trigger_args', help='请输入触发器参数'),
            Argument('desc', required=False),
        ).parse(request.body)
        if error is None:
            form.targets = json.dumps(form.targets)
            form.rst_notify = json.dumps(form.rst_notify)
            # if form.trigger == 'cron':
            # args = json.loads(form.trigger_args)['rule'].split()
            # if len(args) != 5:
            # return json_response(error='无效的执行规则，请更正后再试')
            # minute, hour, day, month, week = args
            # week = '0' if week == '7' else week
            # try:
            # CronTrigger(minute=minute, hour=hour, day=day, month=month, day_of_week=week)
            # except ValueError:
            # return json_response(error='无效的执行规则，请更正后再试')
            if form.id:
                Task.objects.filter(pk=form.id).update(
                    updated_at=human_datetime(),
                    updated_by=request.user,
                    is_active=True,
                    **form
                )
                task = Task.objects.filter(pk=form.id).first()
                if task and task.is_active:
                    form.action = 'modify'
                    form.targets = json.loads(form.targets)
                    rds_cli = get_redis_connection()
                    rds_cli.lpush(settings.SCHEDULE_KEY, json.dumps(form))
            else:
                Task.objects.create(created_by=request.user, is_active=True, **form)

            # form.playbooks = json.loads(form.playbooks)
            # run_ansible.delay(execinfo=request.body.decode())

        return json_response(error=error)

    def delete(self, request):
        taskid = json.loads(request.GET.get("id"))
        num = Task.objects.filter(pk=taskid).update(is_active=False)
        if num == 0:
            return json_response(error={"msg": "删除失败！"})
        else:
            return json_response(data={"msg": "ok"})


class DoAnsibleview(View):
    def post(self, request):
        execinfo = json.loads(request.body.decode())

        if execinfo["state"] == "3":
            run_ansible.delay(execinfo)
        else:
            run_ansible.delay(execinfo)
        return json_response(data={"msg": "ok"})


def show_history(request, task_id=None):
    if request.method == "GET":
        histories = History.objects.filter(task_id=task_id)
        return json_response([x.to_list() for x in histories])


class HistoryView(View):
    def get(self, request, task_id):
        task = Task.objects.filter(pk=task_id).first()
        if not task:
            return json_response(error='未找到指定任务')

        h_id = request.GET.get('id')
        if h_id:
            h_id = task.latest_id if h_id == 'latest' else h_id
            return json_response(self._fetch_detail(h_id))
        histories = History.objects.filter(task_id=task_id)
        return json_response([x.to_list() for x in histories])

    def _fetch_detail(self, h_id):
        record = History.objects.filter(pk=h_id).first()
        data = {'run_time': None, 'success': 0, 'failure': 0, 'duration': 0, 'outputs': []}
        if record is not None:
            outputs = eval(record.output)
            pb_info = [x[0] for x in outputs]
            data['run_time'] = record.run_time
            # for h_id, code, duration, out in outputs:
            for index, info in enumerate(outputs):
                if info[1] == 0:
                    key = 'success'
                    data[key] += 1
                elif info[1] == 1:
                    key = 'failure'
                    data[key] += 1
                data['duration'] += info[2]
                data['outputs'].append({
                    'name': pb_info[index],
                    'code': info[1],
                    'duration': info[2],
                    'output': info[3]})
            data['duration'] = f"{data['duration'] / len(outputs):.3f}"
        return data
