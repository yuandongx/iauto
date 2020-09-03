import os
import hashlib
from shutil import move
from django.views.generic import View
from libs import json_response, JsonParser, Argument, human_datetime
from libs.channel import Channel
from apps.template.models import Template
from apps.host.models import Host
from django.conf import settings


class GenericView(View):
    def get(self, request):
        templates = Template.objects.all()
        types = [x['label'] for x in templates.order_by('label').values('label').distinct()]
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
        templates = Template.objects.filter(flag='network')
        types = [x['label'] for x in templates.order_by('label').values('label').distinct()]
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
        os.mkdirs(templates_path)
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
                    with open(os.path.join(templates_path, name), 'r') as f:
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