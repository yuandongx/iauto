import os
import json
import hashlib
from shutil import move
from django.views.generic import View
from libs import json_response, JsonParser, Argument, human_datetime
from libs.channel import Channel
from apps.template.models import Template, NetworkTemp
from apps.host.models import Host
from django.conf import settings
from apps.template.networks import Hander

class GenericView(View):
    def get(self, request):
        templates = Template.objects.all()
        types = [x['label'] for x in templates.order_by('label').values('label').distinct()]
        print([x.to_dict() for x in templates])  
        return json_response({'types': types, 'templates': [x.to_dict() for x in templates]})

    def post(self, request):
        form, error = JsonParser(
            Argument('id', type=int, required=False),
            Argument('name', help='请输入模版名称'),
            Argument('label', help='请选择模版类型'),
            Argument('content', help='请输入模版内容'),
            Argument('desc', required=False)
        ).parse(request.body)
        if error is None:
            if form.id:
                form.updated_at = human_datetime()
                form.updated_by = request.user
                Template.objects.filter(pk=form.pop('id')).update(**form)
            else:
                form.created_by = request.user
                Template.objects.create(**form)
        return json_response(error=error)

    def delete(self, request):
        form, error = JsonParser(
            Argument('id', type=int, help='请指定操作对象')
        ).parse(request.GET)
        if error is None:
            Template.objects.filter(pk=form.id).delete()
        return json_response(error=error)


class NetworkView(View):
    def get(self, request):
        templates = NetworkTemp.objects.all()
        types = [x['type'] for x in templates.order_by('type').values('type').distinct()]
        return json_response({'types': types, 'templates': [x.to_dict() for x in templates]})

    def post(self, request):
        all_info = json.loads(request.body.decode())
        # print(all_info)
        
        save = all_info.get("save")
        platform = all_info.get("platform")
        hander = Hander(all_info)
        effective_parm, pre_line, all_lines = hander.parse()
        # print(all_lines)
        exist_name = NetworkTemp.objects.values_list("name", flat=True)
        if save:
            # if test_Name in exist_name:
                # return json_response(error="template name same")
            try:
                num = NetworkTemp.objects.create(name=all_info.get("template_name"),
                                          temp_type=all_info.get("template_type"),
                                          parameter=effective_parm,
                                          config_lines="\n".join(all_lines),
                                          desc=all_info.get("template_description"),
                                          created_at=human_datetime(),
                                          created_by=request.user)
            except Exception as E:
                return json_response(error=str(E))
            else:
                return json_response(data={"lines": pre_line, "save": "ok"})
        else:
            return json_response(data={"lines": pre_line})

    def delete(self, request):
        form, error = JsonParser(
            Argument('id', type=int, help='请指定操作对象')
        ).parse(request.GET)
        if error is None:
            NetworkTemp.objects.filter(pk=form.id).delete()
        return json_response(error=error)

def detaile(request):
    obj = NetworkTemp.objects.filter(pk=request.GET["id"])
    if obj:
        return json_response(data=obj)
    return json_response(error="查看失败，或不在...")


