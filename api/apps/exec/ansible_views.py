
import json
from functools import partial
from django_redis import get_redis_connection
from django.conf import settings
from apps.host.models import Host
from django.views.generic import View
from libs import json_response, JsonParser, Argument, human_datetime
from .tasks import run_ansible
from apps.exec.models import Task
from libs import Runner
from threading import Thread

class Ansibleview(View):
    def get(self, request):
        pass

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
        # print(request.body)
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
                    **form
                )
                task = Task.objects.filter(pk=form.id).first()
                if task and task.is_active:
                    form.action = 'modify'
                    form.targets = json.loads(form.targets)
                    rds_cli = get_redis_connection()
                    rds_cli.lpush(settings.SCHEDULE_KEY, json.dumps(form))
            else:
                Task.objects.create(created_by=request.user, **form)

            # form.playbooks = json.loads(form.playbooks)
            print(request.body)
            run_ansible.delay(playbook=form.playbooks, invntory=form.targets)
        return json_response(error=error)