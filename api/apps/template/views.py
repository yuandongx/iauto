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
        types = [x['temp_type'] for x in templates.order_by('temp_type').values('temp_type').distinct()]
        return json_response({'types': types, 'templates': [x.to_dict() for x in templates]})

    def post(self, request):
        all_info = json.loads(request.body.decode())
        save = all_info.get("save")
        platform = all_info.get("platform")
        hander = Hander(all_info)
        effective_parm, pre_line, all_lines = hander.parse()

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

def make_commands(form):
    name, lines = None, []
    if form.platform == 'asa': 
        lines.append("object network %s" % form.name)
        if form.object_type == "1":
            lines.append("host %s" % (form.hostip))
        elif form.object_type == "2":
            lines.append(" range %s %s" % (form.start_ip, form.end_ip))
        elif form.object_type == "3":
            lines.append(" subnet %s %s" % (form.subnet_ip, form.subnet_mask))
    return {"name": name, "lines": lines}

def handle_uploaded_file(f):
    # print(dir(f))
    tmp_path = os.path.join(settings.REPOS_DIR, "tmp.abc.123.XZY")
    if not os.path.exists(tmp_path):
        os.mkdir(tmp_path)
    with open(os.path.join(tmp_path, f.name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def upload_file(request):
    if request.method == 'POST':
        handle_uploaded_file(request.FILES['file'])
    return json_response(data={"msg": "ok"})


def file_md5(path):
    md5 = hashlib.md5()
    with open(path, 'rb') as f:
        md5.update(f.read())
    return md5.hexdigest()


def upload_submit(request):
    ok = []
    override = []
    fail = []
    repeat = False
    tmp_path = os.path.join(settings.REPOS_DIR, "tmp.abc.123.XZY")
    templates_path = os.path.join(settings.REPOS_DIR, "templates")
    if not os.path.exists(templates_path):
        os.makedirs(templates_path)
    if request.method == "POST":
        files_name = request.POST.get('files')
        names = files_name.split(',')
        for name in names:
            repeat = False
            ttype = 'shell' if name.split('.')[-1] == 'sh' else 'ansible-playbook'
            row = {'name': name, 'label': ttype}
            try:
                tmpfile = os.path.join(tmp_path, name)
                md5 = file_md5(tmpfile)
                new_name = md5 + '.' + name.split('.')[-1]
                new_file = os.path.join(templates_path, new_name)
                if os.path.exists(new_file):
                    os.remove(tmpfile)
                    repeat = True
                else:
                    move(tmpfile, new_file)
                row['file_path'] = new_file
                row['md5'] = md5
            except:
                fail.append(name)
            else:
                try:
                    with open(new_file, 'r') as f:
                        row['content'] = f.read()
                except:
                    row['content'] = os.path.join(templates_path, name)
            obj = Template.objects.filter(name__exact=name).first()
            row['created_by'] = request.user
            if repeat and obj is not None:
                override.append(name)
            else:
                ok.append(name)
                Template.objects.create(**row)
    return json_response(dict(ok=ok, fail=fail, override=override))