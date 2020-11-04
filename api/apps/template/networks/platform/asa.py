import time


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
        elif self.parse_type == "asa_service":
            lines = self.__service_parse()
        elif self.parse_type == "asa_service_group":
            lines = self.__servicegroup_parse()
        elif self.parse_type == "asa_time_range":
            lines = self.__schedule_parse()
        elif self.parse_type == "asa_policy":
            lines = self.__policy_parse()
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
                    entries = servicegroup_info.get("entries") or list()
                    for entry in entries:
                        if protocol == "0":
                            if entry["type"] == "group-object":
                                gname = entry.get("gname")
                                if gname:
                                    servicegroup_lines.append("  group-object %s" % gname)
                            elif entry["type"] == "service-object":
                                pass
                        else:
                            if entry["type"] == "group-object":
                                gname = entry.get("gname")
                                if gname:
                                    servicegroup_lines.append("  group-object %s" % gname)
                            elif entry["type"] == "port-object":
                                ptype = entry.get("ptype")
                                start_port = entry.get("port1")
                                end_port = entry.get("port2")
                                if ptype == "range" and start_port and end_port:
                                    servicegroup_lines.append("  port-object range %s %s" % (start_port, end_port))
                                elif ptype == "eq" and start_port:
                                    servicegroup_lines.append("  port-object eq %s" % start_port)
        return servicegroup_lines
        
    def __schedule_parse(self):
        schedule_list = list()
        month_transform = {"1": "January",
                           "2": "February",
                           "3": "March",
                           "4": "April",
                           "5": "May",
                           "6": "June",
                           "7": "July",
                           "8": "August",
                           "9": "September",
                           "10": "October",
                           "11": "November",
                           "12": "December"}
        for parm in self.data:
            schedule_info = parm.get("time_range")
            if schedule_info:
                name = schedule_info.get("name")
                endtime = schedule_info.get("endTime")
                starttime = schedule_info.get("startTime")
                if name and endtime:
                    schedule_list.append("time-range %s" % name)
                    cmd = "  absolute"
                    if starttime:
                        starttime_array = time.strptime(starttime, "%Y-%m-%d %H:%M:%S")
                        cmd += " start %s:%s %s %s %s" % (starttime_array.tm_hour, starttime_array.tm_min, 
                                                          starttime_array.tm_mday, month_transform[str(starttime_array.tm_mon)],
                                                          starttime_array.tm_year)
                    endtime_array = time.strptime(endtime, "%Y-%m-%d %H:%M:%S")
                    cmd += " end %s:%s %s %s %s" % (endtime_array.tm_hour, endtime_array.tm_min, 
                                                      endtime_array.tm_mday, month_transform[str(endtime_array.tm_mon)],
                                                      endtime_array.tm_year)
                    schedule_list.append(cmd)
        return schedule_list
                     
    def __policy_parse(self):
        acl_list = list()
        print(self.data)
        for parm in self.data:
            name = parm.get("name")
            action = parm.get("action")
            protocol = parm.get("protocol")
            src = parm.get("src_address")
            dest = parm.get("dest_address")
            src_port = parm.get("src_port")
            dest_port = parm.get("dest_port")
            schedule = parm.get("time_range")
            print(src)
            print(dest)

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
                acl_list.append(cmd)
        return acl_list
        












                        