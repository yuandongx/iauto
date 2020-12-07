from __future__ import absolute_import, unicode_literals
import json
from celery import shared_task
from libs import human_datetime, AnsibleHandle, human_diff_time
from main.settings import ANSIBLE_LOG_DIR
from apps.exec.models import Task, History
from apps.config.models import Credential
from apps.host.models import Host
from apps.template.models import Template, NetworkTemp
import subprocess
import re
import shutil
import random
import os
from datetime import datetime, timedelta, timezone


@shared_task
def run_ansible(execinfo):
    task_id = execinfo['id']
    task_state = execinfo['state']
    host_list = list()
    playbook_content = list()
    playbook_name = list()
    if task_id:
        taskinfo = Task.objects.filter(pk=task_id, is_active=True)
        if taskinfo.first():
            playbook_ids = taskinfo.first().playbooks
            host_ids = taskinfo.first().targets
            if isinstance(eval(host_ids), list):
                for preid in eval(host_ids):
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
                                host_dict["password"] = cred.password
                            else:
                                host_dict["password"] = ""
                    else:
                        if preid == "local":
                            host_dict["hostname"] = "localhost"
                    if host_dict:
                        host_list.append(host_dict)       
                if isinstance(eval(playbook_ids), list):
                    for prepb in eval(playbook_ids):
                        if prepb.get("type") == "generic":
                            generic_info = Template.objects.filter(pk=prepb.get("id")).first()
                            generic_name = generic_info.name
                            generic_content = generic_info.content
                            if generic_content and generic_name:
                                playbook_content.append(generic_content)
                                playbook_name.append(generic_name)
                        if prepb.get("type") == "network":
                            network_info = NetworkTemp.objects.filter(pk=prepb.get("id")).first()
                            network_name = network_info.name
                            network_lines = network_info.config_lines
                            if network_lines and network_name:
                                network_content = parse_network_playbook(network_lines)
                                playbook_content.append(network_content)
                                playbook_name.append(network_name)
    if host_list and playbook_content:
        ansible_handle = AnsibleHandle(host_list=host_list, playbook_list=playbook_content)
        try:
            status = 1
            history = History.objects.create(
                task_id=task_id,
                celery_id=run_ansible.request.id,
                run_time=datetime.now().astimezone(timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M:%S'),
                status=2,
            )
            host_path, playbook_path_list = ansible_handle.create_tmp()
            results = list()
            if host_path and playbook_path_list:
                for index, pre_p in enumerate(playbook_path_list):
                    starttime = datetime.now().astimezone(timezone(timedelta(hours=8)))
                    result = list()
                    result.append(playbook_name[index])
                    cmd = "ansible-playbook %s -i %s" % (pre_p, host_path)
                    p = subprocess.Popen(
                        cmd,
                        shell=True,
                        stdin=subprocess.PIPE,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                    )
                    outs, err = p.communicate()
                    error = False
                    if err != "" and not err.strip().startswith("[WARNING]"):
                        error = True
                        info = err
                    else:
                        info = outs
                        re_err = re.compile(r'fatal:\s+\[(.*)\]:\s+(\S*)\s+=>\s+(.*)')
                        get_results = re_err.findall(outs)
                        if get_results:
                            error = True
                    if error:
                        status = 1
                        result.append(status)
                    else:
                        status = 0
                        result.append(status)
                    endtime = datetime.now().astimezone(timezone(timedelta(hours=8)))
                    time = (endtime - starttime).total_seconds()
                    result.append(time)
                    result.append(info)
                    results.append(result)
        finally:
            History.objects.filter(id=history.id).update(
                status=status,
                output=results
            )
            taskinfo.update(latest_id=history.id)
            ansible_handle.remove_tmp()

def parse_network_playbook(cmd):
    return "123"

# def result_log(log_dir):
#     date_tag = datetime.datetime.now().strftime("%Y%m%d%H%M%s")
#     random_num = random.randint(1, 99999)
#     is_exist = os.path.exists(log_dir)
#     if not is_exist:
#         os.makedirs(log_dir)
#     log_file = os.path.join(log_dir, "%s_%s" % (date_tag, random_num))
#     return log_file
