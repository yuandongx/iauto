from apps.template.networks import Basic

class Hander(Basic):
    arguments = dict(id=dict(type=int, required=False),
                     name=dict(help='请选输入对象名称'),
                     hostip=dict(required=False),
                     start_ip=dict(required=False),
                     end_ip=dict(required=False),
                     subnet_ip=dict(required=False),
                     subnet_mask=dict(required=False),
                     preview=dict(required=False),
                     kind= dict(help='请选择对象类型'),
                     platform=dict(help='请输入选择设备类型'),
                     feature=dict(help='请选择对象类型'))

    def render(self):
        form = self.form
        name, lines = None, []
        lines.append("object network %s" % form.name)
        if form.kind == "1":
            lines.append("host %s" % (form.hostip))
        elif form.kind == "2":
            lines.append(" range %s %s" % (form.start_ip, form.end_ip))
        elif form.kind == "3":
            lines.append(" subnet %s %s" % (form.subnet_ip, form.subnet_mask))
        return {"name": name, "lines": lines}