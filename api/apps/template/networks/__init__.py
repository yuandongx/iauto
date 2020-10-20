
class Hander(object):
    def __init__(self, data):
        self.data = data
        self.asa_types = ['asa_address', 'asa_address_group', 'asaservice', 'asa_service_group']
        self.topsec_types = ['topsec_address', 'topsec_address_group', 'topsecservice', 'topsecservice_group']
        self.asa_config_lines = list()
        self.topsec_config_lines = list()

    def parse(self):
        all_keys = self.data.keys()
        print(self.data)
        for pre in all_keys:
            info = self.data.get(pre)
            if info:
                if pre in self.asa_types:
                    self.__asa_parse(pre, info)
                if pre in self.topsec_types:
                    self.__topsec_parse(pre, info)
        pre_config_lines = dict()
        all_config_lines = list()
        if self.asa_config_lines:
            pre_config_lines["asa_config_lines"] = self.asa_config_lines
            all_config_lines += self.asa_config_lines
        if self.topsec_config_lines:
            pre_config_lines["topsec_config_lines"] = self.topsec_config_lines
            all_config_lines += self.topsec_config_lines
        return pre_config_lines, all_config_lines  

    def __asa_parse(self, type, data):
        if type == "asa_address":
            for parm in data:
                addr_info = parm.get("address")
                if addr_info:
                    name = addr_info.get("name")
                    if name:
                        addr_type = addr_info.get("type")
                        self.asa_config_lines.append("object network %s" % name)
                        if addr_type == "1":
                            hostip = addr_info.get("hostIp")
                            if addr_type and hostip:
                                self.asa_config_lines.append("  host %s" % hostip)
                        elif addr_type == "2":
                            subnet = addr_info.get("subnet")
                            subnet_mask = addr_info.get("subnetMask")
                            if subnet and subnet_mask:
                                self.asa_config_lines.append("  subnet %s %s" % (subnet, subnet_mask))
                        elif addr_type == "3":
                            startip = addr_info.get("startIp")
                            endip = addr_info.get("endIp")
                            if startip and endip:
                                self.asa_config_lines.append("  range %s %s" % (startip, endip))

        elif type == "asa_address_group":
            for parm in data:
                addrgroup_info = parm.get("address_group")
                if addrgroup_info:
                    name = addrgroup_info.get("name")
                    if name:
                        members = addrgroup_info.get("members")
                        self.asa_config_lines.append("object-group network %s" % name)
                        if members:
                            for men in members:
                                self.asa_config_lines.append("  network-object host %s" % men)
          
        elif type == "asaservice":
            for parm in data:
                service_info = parm.get("service")
                if service_info:
                    name = service_info.get("name")
                    if name:
                        self.asa_config_lines.append("object service %s" % name)
                        protocol = service_info.get("protocol")
                        src_type = service_info.get("srcPortType")
                        dst_type = service_info.get("dstPortType")
                        if all([protocol, src_type, dst_type]):
                            for pro in protocol:
                                srccmd = ""
                                dstcmd = ""
                                src_start_port = service_info.get("srcPort1")
                                if src_type and src_start_port:
                                    if src_type == "range":
                                        src_end_port = service_info.get("srcPort2")
                                        if src_end_port:
                                            srccmd = "  service %s source range %s %s" % (pro, src_start_port, src_end_port)
                                    else:
                                        srccmd = "  service %s source %s %s" % (pro, src_type, src_start_port)
                                if srccmd:
                                    dst_start_port = service_info.get("dstPort1")
                                    if dst_type and dst_start_port:
                                        if dst_type == "range":
                                            dst_end_port = service_info.get("dstPort2")
                                            if dst_end_port:
                                                dstcmd = " destination range %s %s" % (dst_start_port, dst_end_port)
                                        else:
                                            dstcmd = " destination %s %s" % (dst_type, dst_start_port)
                                if srccmd and dstcmd:
                                    self.asa_config_lines.append(srccmd + dstcmd) 
 
        # elif type == "asa_service_group":
            # asa_servicegroup_cmd = list()
            # print(data) 
            # for parm in data:
                # servicegroup_info = parm.get("service_group")
                # if servicegroup_info:
                    # name = servicegroup_info.get("name")
                    # if name:
                        # asa_servicegroup_cmd.append("object-group service %s %" % name)
                        # members = servicegroup_info.get("members")
        
    def __topsec_parse(self, data):
        return True    

