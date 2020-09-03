import json
from django.conf import settings
from django.db import models
from libs import ModelMixin, human_datetime
from apps.account.models import User


class ExecTemplate(models.Model, ModelMixin):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    body = models.TextField()
    desc = models.CharField(max_length=255, null=True)
    flag = models.CharField(max_length=50)
    created_at = models.CharField(max_length=20, default=human_datetime)
    created_by = models.ForeignKey(User, models.PROTECT, related_name='+')
    updated_at = models.CharField(max_length=20, null=True)
    updated_by = models.ForeignKey(User, models.PROTECT, related_name='+', null=True)

    def __repr__(self):
        return '<ExecTemplate %r>' % self.name

    class Meta:
        db_table = 'exec_templates'
        ordering = ('-id',)


class History(models.Model, ModelMixin):
    STATUS = (
        (0, '成功'),
        (1, '异常'),
        (2, '失败'),
        (3, '执行中'),
    )
    task_id = models.IntegerField()
    status = models.SmallIntegerField(choices=STATUS)
    run_time = models.CharField(max_length=20)
    output = models.TextField()

    def to_list(self):
        tmp = super().to_dict(selects=('id', 'status', 'run_time'))
        tmp['status_alias'] = self.get_status_display()
        return tmp

    class Meta:
        db_table = 'ansible_task_histories'
        ordering = ('-id',)


class Task(models.Model, ModelMixin):
    TRIGGERS = (
        ('date', '一次性'),
        ('calendarinterval', '日历间隔'),
        ('cron', 'UNIX cron'),
        ('interval', '普通间隔')
    )
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    playbooks = models.TextField()
    targets = models.TextField()
    trigger = models.CharField(max_length=20, choices=TRIGGERS)
    trigger_args = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    desc = models.CharField(max_length=255, null=True)
    latest = models.ForeignKey(History, on_delete=models.PROTECT, null=True)
    rst_notify = models.CharField(max_length=255, null=True)

    created_at = models.CharField(max_length=20, default=human_datetime)
    created_by = models.ForeignKey(User, models.PROTECT, related_name='+')
    updated_at = models.CharField(max_length=20, null=True)
    updated_by = models.ForeignKey(User, models.PROTECT, related_name='+', null=True)

    def to_dict(self, *args, **kwargs):
        tmp = super().to_dict(*args, **kwargs)
        tmp['targets'] = json.loads(self.targets)
        tmp['latest_status'] = self.latest.status if self.latest else None
        tmp['latest_run_time'] = self.latest.run_time if self.latest else None
        tmp['latest_status_alias'] = self.latest.get_status_display() if self.latest else None
        tmp['rst_notify'] = json.loads(self.rst_notify) if self.rst_notify else {'mode': '0'}
        if self.trigger == 'cron':
            tmp['trigger_args'] = json.loads(self.trigger_args)
        return tmp

    def __repr__(self):
        return '<Ansible Task %r>' % self.name

    class Meta:
        db_table = 'ansible_tasks'
        ordering = ('-id',)