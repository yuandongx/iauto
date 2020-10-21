
def topsec_parse(type, data):
    if type and data:
        cmd_list = Parse(type, data).work()
        return cmd_list
    return list()
    
class Parse(object):
    def __init__(self, type, data):
        self.parse_type = type
        self.data = data

    def work(self):
        lines = list()
        if self.parse_type == "asa_address":
            lines = self.__address_parse()
        elif self.parse_type == "asa_address_group":
            lines = self.__addressgroup_parse()
        elif self.parse_type == "asaservice":
            lines = self.__service_parse()
        elif self.parse_type == "asa_service_group":
            lines = self.__servicegroup_parse()
        return lines

    def __address_parse(self):
        pass