
from django.db.models import F
from apps.app.models import App
from apps.host.models import Host
from apps.schedule.models import Task as Schedule_task
from apps.exec.models import Task as Exec_task
from apps.exec.models import ExecTemplate
from apps.template.models import NetworkTemp
from apps.monitor.models import Detection
from apps.alarm.models import Alarm
from apps.deploy.models import Deploy, DeployRequest
from libs.utils import json_response, human_date, parse_time
from libs.parser import JsonParser, Argument
from datetime import datetime, timedelta
import json


def get_host_statistic(request):
    all_host_type = Host.objects.filter(deleted_at__isnull=True).values('zone')
    num_type = dict()
    for pre in all_host_type:
        if num_type.get(pre['zone']):
            num_type[pre['zone']] += 1
        else:
            num_type[pre['zone']] = 1
    data = [{'type': k, 'value': v} for k, v in num_type.items()]
    return json_response(data)
    
def get_hostinfo(request):
    all_host = Host.objects.filter(deleted_at__isnull=True).values()
    host_info_dict = dict()
    
    host_list = list()
    name_filter_list = list()
    type_filter_list = list()
    addr_filter_list = list()
    user_filter_list = list()
    port_filter_list = list()
    
    for index,info in enumerate(all_host):
        pre_info = dict()
        pre_info['key'] = index
        pre_info['name'] = info.get("name")
        pre_info['type'] = info.get("zone")
        pre_info['address'] = info.get("hostname")
        pre_info['user'] = info.get("username")
        pre_info['port'] = info.get("port")
        host_list.append(pre_info)
        
        name_filter = {"text": info.get("name"), "value": info.get("name")}
        if name_filter not in name_filter_list:
            name_filter_list.append(name_filter)
        
        type_filter = {"text": info.get("zone"), "value": info.get("zone")}
        if type_filter not in type_filter_list:
            type_filter_list.append(type_filter)
        
        addr_filter = {"text": info.get("hostname"), "value": info.get("hostname")}
        if addr_filter not in addr_filter_list:
            addr_filter_list.append(addr_filter) 
            
        user_filter = {"text": info.get("username"), "value": info.get("username")}
        if user_filter not in user_filter_list:
            user_filter_list.append(user_filter)

        port_filter = {"text": info.get("port"), "value": info.get("port")}
        if port_filter not in port_filter_list:
            port_filter_list.append(port_filter)
    host_info_dict["host_list"] =  host_list       
    host_info_dict["name_filter_list"] =  name_filter_list       
    host_info_dict["type_filter_list"] =  type_filter_list       
    host_info_dict["addr_filter_list"] =  addr_filter_list       
    host_info_dict["user_filter_list"] =  user_filter_list       
    host_info_dict["port_filter_list"] =  port_filter_list           
    return json_response(host_info_dict)   
    
def get_task_statistic(request):
    sche_task_type = Schedule_task.objects.filter(is_active=True).values('type')
    exec_task_type = Exec_task.objects.filter(is_active=True).values('type')
    all_type = list(sche_task_type) + list(exec_task_type)
    num_type = dict()
    for pre in all_type:
        if num_type.get(pre['type']):
            num_type[pre['type']] += 1
        else:
            num_type[pre['type']] = 1
    data = [{'type': k, 'value': v} for k, v in num_type.items()]
    return json_response(data)

def get_tempinfo(request):
    general_temp = ExecTemplate.objects.all().values()
    network_temp = NetworkTemp.objects.all().values()
    temp_info_dict = dict()
    all_temp_list = list()
    name_filter_list = list()
    type_filter_list = list()
    index = 1
    for info in general_temp:
        pre_info = dict()
        pre_info['key'] = index
        pre_info['name'] = info.get("name")
        pre_info['type'] = info.get("type")
        pre_info['content'] = info.get("body")
        pre_info['desc'] = info.get("desc")
        all_temp_list.append(pre_info)
        index += 1
        
        name_filter = {"text": info.get("name"), "value": info.get("name")}
        if name_filter not in name_filter_list:
            name_filter_list.append(name_filter)
        
        type_filter = {"text": info.get("type"), "value": info.get("type")}
        if type_filter not in type_filter_list:
            type_filter_list.append(type_filter)
   
    for info in network_temp:
        pre_info = dict()
        pre_info['key'] = index
        pre_info['name'] = info.get("name")
        pre_info['type'] = info.get("type")
        pre_info['content'] = info.get("config_lines")
        pre_info['desc'] = info.get("desc")
        all_temp_list.append(pre_info)
        index += 1   
        
        name_filter = {"text": info.get("name"), "value": info.get("name")}
        if name_filter not in name_filter_list:
            name_filter_list.append(name_filter)
        
        type_filter = {"text": info.get("type"), "value": info.get("type")}
        if type_filter not in type_filter_list:
            type_filter_list.append(type_filter)
            
    temp_info_dict["temp_list"] =  all_temp_list       
    temp_info_dict["name_filter_list"] =  name_filter_list       
    temp_info_dict["type_filter_list"] =  type_filter_list 
    return json_response(temp_info_dict)

def get_temp_statistic(request):
    general_temp = ExecTemplate.objects.all().values("type")
    network_temp = NetworkTemp.objects.all().values("type")
    all_type = list(general_temp) + list(network_temp)
    num_type = dict()
    for pre in all_type:
        if num_type.get(pre['type']):
            num_type[pre['type']] += 1
        else:
            num_type[pre['type']] = 1
    data = [{'type': k, 'value': v} for k, v in num_type.items()]
    return json_response(data)

def get_alarm(request):
    now = datetime.now()
    data = {human_date(now - timedelta(days=x + 1)): 0 for x in range(14)}
    for alarm in Alarm.objects.filter(status='1', created_at__gt=human_date(now - timedelta(days=14))):
        date = alarm.created_at[:10]
        if date in data:
            data[date] += 1
    data = [{'date': k, 'value': v} for k, v in data.items()]
    return json_response(data)


def get_request(request):
    form, error = JsonParser(
        Argument('duration', type=list, help='参数错误')
    ).parse(request.body)
    if error is None:
        s_date = form.duration[0]
        e_date = (parse_time(form.duration[1]) + timedelta(days=1)).strftime('%Y-%m-%d')
        data = {x.id: {'name': x.name, 'count': 0} for x in App.objects.all()}
        for req in DeployRequest.objects.filter(created_at__gt=s_date, created_at__lt=e_date):
            data[req.deploy.app_id]['count'] += 1
        data = sorted(data.values(), key=lambda x: x['count'], reverse=True)[:10]
        return json_response(data)
    return json_response(error=error)

def get_deploy(request):
    host = Host.objects.filter(deleted_at__isnull=True).count()
    data = {x.id: {'name': x.name, 'count': 0} for x in App.objects.all()}
    for dep in Deploy.objects.all():
        data[dep.app_id]['count'] += len(json.loads(dep.host_ids))
    data = filter(lambda x: x['count'], data.values())
    return json_response({'host': host, 'res': list(data)})

