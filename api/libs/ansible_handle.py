import os
import json
import shutil
import datetime
import random


class AnsibleHandle(object):
    def __init__(self, host_list=list(), playbook_list=list()):
        self.host_list = host_list
        self.playbook_list = playbook_list
        self.__create_tmp_dir()

    def __create_tmp_dir(self):
        date_tag = datetime.datetime.now().strftime("%Y%m%d%H%M%s")
        random_num = random.randint(1, 99999)
        tmp_dir = os.path.join("/tmp/ansible", "%s_%s" % (date_tag, random_num))
        is_exist = os.path.exists(tmp_dir)
        if is_exist:
            shutil.rmtree(tmp_dir)
            os.makedirs(tmp_dir)
        else:
            os.makedirs(tmp_dir)
        self.tmp_dir = tmp_dir

    def __create_host(self):
        if self.host_list:
            host_path = os.path.join(self.tmp_dir, "hosts")
            with open(host_path, "a") as file:
                for pre in self.host_list:
                    if pre["hostname"] == "localhost":
                        file.write("localhost ansible_connection=local\n")
                    else:
                        text_base = "%s ansible_host=%s ansible_user=%s ansible_password=%s ansible_port=%s" % (
                        pre["hostname"], pre["hostname"], pre["username"], pre["password"], pre["port"])
                        if pre.get("network_os"):
                            text_network = " ansible_network_os=%s ansible_connection=network_cli" % pre["network_os"]
                            text_base += text_network
                        if pre.get("become_pass"):
                            text_become = " ansible_become_password=%s ansible_become_method=enable" % pre["become_pass"]
                            text_base += text_become
                        text_base += "\n"
                        file.write(text_base)
            return host_path

    def __create_playbook(self):
        if self.playbook_list:
            playbook_path_list = list()
            for index,content in enumerate(self.playbook_list):
                pre_playbook_path = os.path.join(self.tmp_dir, "exec_tmp_%s.yml" % str(index))
                with open(pre_playbook_path, "a") as file:
                    file.write(content)
                    file.write("\n")
                playbook_path_list.append(pre_playbook_path)
            return playbook_path_list

    def create_tmp(self):
        host_path = self.__create_host()
        playbook_path_list = self.__create_playbook()
        return host_path, playbook_path_list

    def remove_tmp(self):
        if os.path.exists(self.tmp_dir):
            shutil.rmtree(self.tmp_dir)


