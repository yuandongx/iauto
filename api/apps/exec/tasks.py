from __future__ import absolute_import, unicode_literals
import json
from celery import shared_task
from libs import human_datetime, AnsibleHandle
from apps.exec.models import Task, History
from apps.config.models import Credential
from apps.host.models import Host
import subprocess
import re
import shutil
import random
import os


@shared_task
def run_ansible(**kwargs):
    execinfo = json.loads(kwargs['execinfo'])
    print(execinfo)
    hosts_id = execinfo['targets']
    playbooks = execinfo['playbooks']
    host_list = list()
    playbook_list = list()
    if hosts_id:
        for preid in hosts_id:
            host_dict = dict()
            if isinstance(preid, int):
                host_info = Host.objects.filter(pk=preid, deleted_at__isnull=True).first()
                if host_info:
                    host_dict["hostname"] = host_info.hostname
                    host_dict["port"] = host_info.port
                    host_dict["username"] = host_info.username
                    access_credentials = host_info.access_credentials
                    cred = Credential.objects.filter(name=access_credentials).first()
                    if cred:
                        host_dict["password"] = cred.pwd
                    else:
                        host_dict["password"] = ""

            elif isinstance(preid, str) and preid == "local":
                host_dict["hostname"] = "localhost"
            if host_dict:
                host_list.append(host_dict)
    # if playbooks:
    #     for pb in playbooks:
    #         content = pb.get("content")
    #         if content:
    #             playbook_list.append(content)
    # if host_list and playbook_list:
    #     ansible_handle = AnsibleHandle(host_list=host_list, playbook_list=playbook_list)
    #     try:
    #         host_path, playbook_path_list = ansible_handle.create_tmp()
    #         if host_path and playbook_path_list:
    #             # history = History.objects.filter(pk='4345353').first()
    #             for pre_p in playbook_path_list:
    #                 cmd = "ansible-playbook %s -i %s" % (pre_p, host_path)
    #                 p = subprocess.Popen(
    #                     cmd,
    #                     shell=True,
    #                     stdin=subprocess.PIPE,
    #                     stdout=subprocess.PIPE,
    #                     stderr=subprocess.PIPE,
    #                     text=True,
    #                 )
    #                 outs, err = p.communicate()
    #                 errors = dict()
    #                 if err != "" and not err.strip().startswith("[WARNING]"):
    #                     errors["exec_err"] = err
    #                 else:
    #                     re_err = re.compile(r'fatal:\s+\[(.*)\]:\s+(\S*)\s+=>\s+(.*)')
    #                     results = re_err.findall(outs)
    #                     if results:
    #                         errors = dict()
    #                         for result in results:
    #                             errors[result[0]] = json.loads(result[2])
    #                 print(errors)
    #     finally:
    #         ansible_handle.remove_tmp()

    return execinfo

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
