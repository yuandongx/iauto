
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
        if self.parse_type == "topsec_address":
            lines = self.__address_parse()
        elif self.parse_type == "topsec_address_group":
            lines = self.__addressgroup_parse()
        elif self.parse_type == "topsecservice":
            lines = self.__service_parse()
        elif self.parse_type == "topsec_service_group":
            lines = self.__servicegroup_parse()
        return lines

    def __address_parse(self):
        addr_lines = list()
        for parm in self.data:
            addr_info = parm.get("address")
            if addr_info:
                name = addr_info.get("name")
                if name:
                    cmd = None
                    addr_type = addr_info.get("type")
                    if addr_type == "1":
                        pass
                        # hostip = addr_info.get("hostIp")
                        # if hostip:
                            # cmd = "define host add name %s" % (name)
                    elif addr_type == "2":
                        subnet = addr_info.get("subnet")
                        subnet_mask = addr_info.get("subnetMask")
                        if subnet and subnet_mask:
                            cmd = "define subnet add name %s ipaddr %s mask %s" % (name, subnet, subnet_mask)
                    elif addr_type == "3":
                        startip = addr_info.get("startIp")
                        endip = addr_info.get("endIp")
                        if startip and endip:
                            cmd = "define range add name %s ip1 %s ip2 %s" % (name, startip, endip)
                    if cmd:
                        addr_lines.append(cmd)
        return addr_lines
        
    def __addressgroup_parse(self):
        addrgroup_lines = list()
        for parm in self.data:
            addrgroup_info = parm.get("address_group")
            if addrgroup_info:
                name = addrgroup_info.get("name")
                if name:
                    members = addrgroup_info.get("members")
                    if members:
                        host_str = ""
                        for men in members:
                            host_str += "%s " % men
                        addrgroup_lines.append("define group_address add name %s menber '%s'" % (name, host_str))
        return addrgroup_lines
        
    def __service_parse(self):
        pass
    
    