
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
        elif self.parse_type == "topsec_service":
            lines = self.__service_parse()
        elif self.parse_type == "topsec_service_group":
            lines = self.__servicegroup_parse()
        elif self.parse_type == "topsec_time_range":
            lines = self.__schedule_parse()
        elif self.parse_type == "topsec_acl":
            lines = self.__acl_parse()
        return lines

    def __address_parse(self):   
        addr_lines = list()
        print(self.data)
        for parm in self.data:
            addr_info = parm.get("address")
            if addr_info:
                name = addr_info.get("name")
                if name:
                    cmd = None
                    addr_type = addr_info.get("type")
                    if addr_type == "1":
                        pass
                        hostip = addr_info.get("hostIp")
                        if hostip:
                            str_ip = ""
                            for ip in hostip:
                                str_ip +=  "%s " % ip
                            cmd = "define host add name %s ipaddr '%s'" % (name, str_ip)
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
        service_lines = list()
        protocol_dict = {"tcp": "6",
                         "udp": "17"}
        for parm in self.data:
            service_info = parm.get("service")
            if service_info:
                name = service_info.get("name")
                if name:
                    protocol = service_info.get("protocol")
                    port1 = service_info.get("port1")
                    port2 = service_info.get("port2")
                    if protocol and port1:
                        for pre in protocol:
                            if port2:
                                service_lines.append("define service add name %s protocol %s port %s port2 %s" % (name, protocol_dict.get(pre), port1, port2)) 
                            else:
                                service_lines.append("define service add name %s protocol %s port %s" % (name, protocol_dict.get(pre), port1)) 
        return service_lines

    def __servicegroup_parse(self):
        servicegroup_lines = list()
        for parm in self.data:
            servicegroup_info = parm.get("service_group")
            if servicegroup_info:
                name = servicegroup_info.get("name")
                if name:
                    members = servicegroup_info.get("members")
                    if members:
                        member_str = ""
                        for mem in members:
                            member_str += "%s " % mem
                        servicegroup_lines.append("define group_service add name %s member '%s'" % (name, member_str))
        return  servicegroup_lines

    def __schedule_parse(self):
        schedule_list = list()
        for parm in self.data:
            schedule_info = parm.get("time_range")
            if schedule_info:
                name = schedule_info.get("name")
                endtime = schedule_info.get("endTime")
                starttime = schedule_info.get("startTime")
                if name and endtime and starttime:
                    sdate = starttime.split()[0]
                    stime = starttime.split()[1]
                    edate = endtime.split()[0]
                    etime = endtime.split()[1]
                    cmd = "define schedule add name %s cyctype yearcyc sdate %s stime %s edate %s etime %s" % (name, sdate, stime, edate, etime)
                    schedule_list.append(cmd)
        return schedule_list

    def __acl_parse(self):
        policy_list = list()
        for parm in self.data:
            name = parm.get("name")
            action = parm.get("action")
            protocol = parm.get("protocol")
            src = parm.get("src_address")
            dest = parm.get("dest_address")
            src_port = parm.get("src_port")
            dest_port = parm.get("dest_port")
            schedule = parm.get("time_range")
            if all([name, action, protocol, src, dest]):
                cmd = "access-list %s extended %s %s" % (name, action, protocol)
                if src:
                    src_type = src.get("type")
                    if src_type == "host":
                        ip = src.get("ip")
                        if not ip:
                            continue
                        cmd += " host %s" % ip
                    elif src_type == "subnet":
                        subnet = src.get("ip")
                        mask = src.get("mask")
                        if not subnet or not mask:
                            continue
                        cmd += " %s %s" % (subnet, mask)
                    elif src_type == "any":
                        cmd += " any"
                    else:
                        ob = src.get("ip")
                        if not ob:
                            continue
                        cmd += " object-group %s" % ob

                if src_port and protocol in ["tcp", "udp"]:
                    port_type = src_port.get("type")
                    port_num = src_port.get("port1")
                    if port_type == "range":
                        port_num_end = src_port.get("port2")
                        if all([port_type, port_num, port_num_end]):
                            cmd += " range %s %s" % (port_type, port_num, port_num_end)
                        else:
                            continue
                    else:
                        if all([port_type, port_num]):
                            cmd += " %s %s" %(port_type, port_num)
                        else:
                            continue
                
                if dest:
                    dest_type = dest.get("type")
                    if dest_type == "host":
                        ip = dest.get("ip")
                        if not ip:
                            continue
                        cmd += " host %s" % ip
                    elif dest_type == "subnet":
                        subnet = dest.get("ip")
                        mask = dest.get("mask")
                        if not subnet or not mask:
                            continue
                        cmd += " %s %s" % (subnet, mask)
                    elif dest_type == "any":
                        cmd += " any"
                    else:
                        ob = dest.get("ip")
                        if not ob:
                            continue
                        cmd += " object-group %s" % ob

                if dest_port and protocol in ["tcp", "udp"]:
                    port_type = dest_port.get("type")
                    port_num = dest_port.get("port1")
                    if port_type == "range":
                        port_num_end = dest_port.get("port2")
                        if all([port_type, port_num, port_num_end]):
                            cmd += " range %s %s" % (port_type, port_num, port_num_end)
                        else:
                            continue
                    else:
                        if all([port_type, port_num]):
                            cmd += " %s %s" %(port_type, port_num)
                        else:
                            continue
                            
                if schedule:
                    cmd += " time-range %s" % schedule
                policy_list.append(cmd)
        return policy_list

