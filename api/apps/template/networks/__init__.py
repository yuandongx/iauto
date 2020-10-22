from apps.template.networks.platform import asa_parse, topsec_parse


class Hander(object):
    def __init__(self, data):
        self.data = data

    def parse(self):
        pre_config_lines = dict()
        all_config_lines = list()
        effective_parm = dict()
        platform = self.data.get("platform")
        for pre, info in self.data.items():
            if info:
                cfg_lines = list()
                if platform == "asa" and pre.startswith("asa"):
                    effective_parm[pre] = info
                    cfg_lines = asa_parse(pre, info)
                if platform == "topsec" and pre.startswith("topsec"):
                    effective_parm[pre] = info
                    cfg_lines = topsec_parse(pre, info)
                if cfg_lines:
                    all_config_lines.extend(cfg_lines)
                    pre_config_lines[pre] = cfg_lines

        return effective_parm, pre_config_lines, all_config_lines
   

