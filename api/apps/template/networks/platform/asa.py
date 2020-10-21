  
def asa_parse(type, data):
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
        addr_lines = list()
        for parm in self.data:
            addr_info = parm.get("address")
            if addr_info:
                name = addr_info.get("name")
                if name:
                    addr_type = addr_info.get("type")
                    addr_lines.append("object network %s" % name)
                    if addr_type == "1":
                        hostip = addr_info.get("hostIp")
                        if addr_type and hostip:
                            addr_lines.append("  host %s" % hostip)
                    elif addr_type == "2":
                        subnet = addr_info.get("subnet")
                        subnet_mask = addr_info.get("subnetMask")
                        if subnet and subnet_mask:
                            addr_lines.append("  subnet %s %s" % (subnet, subnet_mask))
                    elif addr_type == "3":
                        startip = addr_info.get("startIp")
                        endip = addr_info.get("endIp")
                        if startip and endip:
                            addr_lines.append("  range %s %s" % (startip, endip))
        return addr_lines

    def __addressgroup_parse(self):
        addrgroup_lines = list()
        for parm in self.data:
            addrgroup_info = parm.get("address_group")
            if addrgroup_info:
                name = addrgroup_info.get("name")
                if name:
                    members = addrgroup_info.get("members")
                    addrgroup_lines.append("object-group network %s" % name)
                    if members:
                        for men in members:
                            addrgroup_lines.append("  network-object host %s" % men)
        return addrgroup_lines

    def __service_parse(self):
        service_lines = list()
        for parm in self.data:
            service_info = parm.get("service")
            if service_info:
                name = service_info.get("name")
                if name:
                    service_lines.append("object service %s" % name)
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
                                service_lines.append(srccmd + dstcmd)
        return service_lines

    def __servicegroup_parse(self):
        servicegroup_lines = list() 
        for parm in self.data:
            servicegroup_info = parm.get("service_group")
            if servicegroup_info:
                name = servicegroup_info.get("name")
                if name:
                    cmd = "object-group service %s" % name
                    protocol = servicegroup_info.get("protocol")
                    if protocol == "1":
                        cmd += " tcp"
                    elif protocol == "2":
                        cmd += " udp"
                    elif protocol == "3":
                        cmd += " tcp-udp"
                    servicegroup_lines.append(cmd)
                    members = servicegroup_info.get("members")