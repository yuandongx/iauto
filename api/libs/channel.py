
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import uuid

layer = get_channel_layer()


class Channel:
    @staticmethod
    def get_token():
        return uuid.uuid4().hex

    @staticmethod
    def send_ssh_executor(hostname, port, username, command, token=None):
        message = {
            'type': 'ssh',
            'token': token,
            'hostname': hostname,
            'port': port,
            'username': username,
            'command': command
        }
        async_to_sync(layer.send)('task_runner', message)

    @staticmethod
    def send_ansible_executor(hostinfo, playbooks, token=None):
        message = {
            'type': 'ansible',
            'token': token,
            'hostsinfo': hostname,
            'playbooks': playbooks
        }
        async_to_sync(layer.send)('task_runner', message)
