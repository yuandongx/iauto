from __future__ import absolute_import, unicode_literals

from celery import shared_task
from libs import ansible_run

@shared_task
def run_ansible(**kwargs):
    return ansible_run(**kwargs)