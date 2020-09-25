
from queue import Queue
from threading import Thread
from libs.ssh import SSH, AuthenticationException
from apps.host.models import Host
from apps.config.models import Credential
from django.db import close_old_connections
import subprocess
import socket
import time


def local_executor(q, command):
    exit_code, out, now = -1, None, time.time()
    try:
        task = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        exit_code = task.wait()
        out = task.stdout.read() + task.stderr.read()
    finally:
        q.put(('local', exit_code, round(time.time() - now, 3), out.decode()))


def host_executor(q, host, password, command):
    exit_code, out, now = -1, None, time.time()
    try:
        cli = SSH(host.hostname, host.port, host.username, password)
        exit_code, out = cli.exec_command(command)
        out = out if out else None
    except AuthenticationException:
        out = 'ssh authentication fail'
    except socket.error as e:
        out = f'network error {e}'
    finally:
        q.put((host.id, exit_code, round(time.time() - now, 3), out))


def dispatch(command, targets, in_view=False):
    if not in_view:
        close_old_connections()
    threads, q = [], Queue()
    for t in targets:
        if t == 'local':
            threads.append(Thread(target=local_executor, args=(q, command)))
        elif isinstance(t, int):
            host = Host.objects.filter(pk=t).first()
            cred = Credential.objects.filter(name=f'{host.username}@{host.hostname}').first()
            if not host:
                raise ValueError(f'unknown host id: {t!r}')
            threads.append(Thread(target=host_executor, args=(q, host, cred.password, command)))
        else:
            raise ValueError(f'invalid target: {t!r}')
    for t in threads:
        t.start()
    return [q.get() for _ in threads]
