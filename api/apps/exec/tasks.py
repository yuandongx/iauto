from __future__ import absolute_import, unicode_literals
import json
from celery import shared_task
from libs import Runner, human_datetime
from apps.exec.models import Task, History
import subprocess
import re

@shared_task
def run_ansible(**kwargs):
    # results_callback = ResultsCollectorJSONCallback()
    # # kwargs['callback'] = results_callback
    # cmd = "ansible-playbook %s -i %s" % (kwargs['playbook'], kwargs['invntory'])
    # print(cmd)
    # p = subprocess.Popen(
    #     cmd,
    #     shell=True,
    #     stdin=subprocess.PIPE,
    #     stdout=subprocess.PIPE,
    #     stderr=subprocess.PIPE,
    #     text=True,
    # )
    # outs, errors = p.communicate()
    #
    # if errors != "" and not errors.strip().startswith("[WARNING]"):
    #     return {"host": "testhost", "err": errors}
    # else:
    #     re_err = re.compile(r'fatal:\s+\[(.*)\]:\s+(\S*)\s+=>\s+(.*)')
    #     result = re_err.findall(outs)
    #     print(result)
    # playbooks = json.loads(kwargs.playbooks)
    # print(playbooks)
    return json.loads(kwargs)

    # history = History.objects.filter(pk='4345353').first()
    # if not history:
    #     history = History.objects.create(
    #         task_id=2,
    #         status=2,
    #         run_time=human_datetime(),
    #         output=json.dumps(result)
    #     )
    # else:
    #     history.output=json.dumps(result)
    #     history.save()