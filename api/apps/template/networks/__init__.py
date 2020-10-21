from apps.template.networks.platform import asa_parse#, topsec_parse



class Hander(object):
    def __init__(self, data):
        self.data = data
        self.asa_types = ['asa_address', 'asa_address_group', 'asaservice', 'asa_service_group']
        self.topsec_types = ['topsec_address', 'topsec_address_group', 'topsecservice', 'topsecservice_group']

    def parse(self):
        all_keys = self.data.keys()
        pre_config_lines = dict()
        all_config_lines = list()
        for pre in all_keys:
            info = self.data.get(pre)
            if info:
                cfg_lines = list()
                if pre in self.asa_types:
                    cfg_lines = asa_parse(pre, info)
                if pre in self.topsec_types:
                    pass
                    # cfg_lines = topsec_parse(pre, info)

                if cfg_lines:
                    all_config_lines.extend(cfg_lines)
                    pre_config_lines[pre] = cfg_lines

        return pre_config_lines, all_config_lines  
   

