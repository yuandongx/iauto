from __future__ import absolute_import, unicode_literals
import json
from celery import shared_task
from libs import Runner, human_datetime
from apps.exec.models import Task, History

@shared_task
def run_ansible(**kwargs):
    # results_callback = ResultsCollectorJSONCallback()
    # kwargs['callback'] = results_callback
    ansible = Runner(**kwargs)
    ansible.run()
    result = {}
    # print("OK *******")
    # for host, result in ansible.result_callback.host_ok.items():
        # result.append('{0} >>> {1}'.format(host, result._result['stdout']))
    # print("FAILED *******")
    # for host, result in ansible.result_callback.host_failed.items():
        # result.append('{0} >>> {1}'.format(host, result._result['msg']))

    # print("DOWN *********")
    # for host, result in ansible.result_callback.host_unreachable.items():
        # result.append('{0} >>> {1}'.format(host, result._result['msg']))
    # result['ok'] = ansible.result_callback.host_ok
    # result['failed'] = ansible.result_callback.host_failed
    # result['unreachable'] = ansible.result_callback.host_unreachable

    history = History.objects.filter(pk='4345353').first()
    if not history:
        history = History.objects.create(
            task_id=2,
            status=2,
            run_time=human_datetime(),
            output=json.dumps(result)
        )
    else:
        history.output=json.dumps(result)
        history.save()