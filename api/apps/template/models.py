from django.conf import settings
from django.db import models
from libs import ModelMixin, human_datetime
from apps.account.models import User


class Template(models.Model, ModelMixin):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    content = models.TextField()
    desc = models.CharField(max_length=255, null=True)
    created_at = models.CharField(max_length=20, default=human_datetime)
    created_by = models.ForeignKey(User, models.PROTECT, related_name='+')
    updated_at = models.CharField(max_length=20, null=True)
    updated_by = models.ForeignKey(User, models.PROTECT, related_name='+', null=True)
    file_path = models.CharField(max_length=200)
    flag = models.CharField(max_length=50, null=True)
    md5 = models.CharField(max_length=50, null=True)

    def __repr__(self):
        return '<Iauto-Templates %r>' % self.name

    class Meta:
        db_table = 'iauto_templates'
        ordering = ('-id',)
        
class NetworkTemp(models.Model, ModelMixin):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    parameter = models.TextField()
    config_lines = models.TextField()
    desc = models.CharField(max_length=255, null=True)
    created_at = models.CharField(max_length=20, default=human_datetime)
    created_by = models.ForeignKey(User, models.PROTECT, related_name='+')
    
    class Meta:
        db_table = 'iauto_network_templates'
        ordering = ('-id',)
