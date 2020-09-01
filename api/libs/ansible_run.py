import json
import shutil
import os
import subprocess
from yaml import load
from apps.exec.models import History

try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader


IMPORTED = False
try:
    from ansible.executor.playbook_executor import PlaybookExecutor as _PlaybookExecutor
    from ansible.errors import AnsibleError, AnsibleOptionsError, AnsibleParserError
    from ansible.module_utils._text import to_text
    import ansible.constants as C
    from ansible.executor.task_queue_manager import TaskQueueManager
    from ansible.module_utils.common.collections import ImmutableDict
    from ansible.inventory.manager import InventoryManager
    from ansible.parsing.dataloader import DataLoader
    from ansible.plugins.callback import CallbackBase
    from ansible.vars.manager import VariableManager
    from ansible import context
    IMPORTED = True
except ImportError:
    IMPORTED = False
    pass


class AnsibleRunnerException(Exception):
    pass

# Create a callback plugin so we can capture the output
class ResultsCollectorJSONCallback(CallbackBase):
    """A sample callback plugin used for performing an action as results come in.

    If you want to collect all results into a single object for processing at
    the end of the execution, look into utilizing the ``json`` callback plugin
    or writing your own custom callback plugin.
    """

    def __init__(self, *args, **kwargs):
        super(ResultsCollectorJSONCallback, self).__init__(*args, **kwargs)
        self.host_ok = {}
        self.host_unreachable = {}
        self.host_failed = {}
    def v2_on_any(self, *args, **kwargs):
        print('121312312234234234', args, kwargs)

    def v2_runner_on_unreachable(self, result):
        host = result._host
        self.host_unreachable[host.get_name()] = result
        print('11111', result)

    def v2_runner_on_ok(self, result, *args, **kwargs):
        """Print a json representation of the result.

        Also, store the result in an instance attribute for retrieval later
        """
        host = result._host
        self.host_ok[host.get_name()] = result
        print('22222', json.dumps({host.name: result._result}, indent=4))

    def v2_runner_on_failed(self, result, *args, **kwargs):
        host = result._host
        self.host_failed[host.get_name()] = result
        print('3333', json.dumps({host.name: result._result}, indent=4))

class PlaybookExecutor(_PlaybookExecutor):
    def __init__(self, playbooks, inventory):
        self._playbooks = playbooks
        self._loader = DataLoader()
        self.results_callback = ResultsCollectorJSONCallback()
        self._inventory = InventoryManager(loader=self._loader, sources=inventory)
        self._variable_manager = VariableManager(loader=self._loader, inventory=self._inventory)
        self.passwords = dict(vault_pass='secret')
        self._unreachable_hosts = dict()
        context.CLIARGS = ImmutableDict(connection='smart',
                                        module_path=['/to/mymodules', '/usr/share/ansible'],
                                        forks=10,
                                        become=False,
                                        become_method=None,
                                        become_user=None,
                                        check=False,
                                        syntax=False,
                                        start_at_task=None,
                                        diff=False)
        if context.CLIARGS.get('listhosts') or context.CLIARGS.get('listtasks') or \
                context.CLIARGS.get('listtags') or context.CLIARGS.get('syntax'):
            self._tqm = None
        else:
            self._tqm = TaskQueueManager(
                inventory=self._inventory,
                variable_manager=self._variable_manager,
                loader= self._loader,
                passwords= self.passwords,
                forks=10,
                stdout_callback=self.results_callback
            )



class Runner(object):
    def __init__(self, **kwargs):
        self.args = ['ansible-playbook']
        self.invntory = kwargs.get('invntory')
        self.task_id = kwargs.get('task_id')
        self.playbooks = kwargs.get('playbook')
        self.init_args(**kwargs)

    def init_args(self, **kwargs):
        self.playbooks = kwargs.get('playbook')
        if self.playbooks is not None and isinstance(self.playbooks, str):
            self.playbooks = [self.playbooks]
        if self.playbooks is None or not isinstance(self.playbooks, list):
            raise AnsibleRunnerException(f'TypeError: the playbook should a list or a string.')
        for playbook in self.playbooks:
            if not os.path.exists(playbook):
                raise AnsibleRunnerException(f'The playbook {playbook} does not exist.')
            else:
                try:
                    with open(playbook, 'r') as f:
                        load(f, Loader=Loader)
                except:
                    raise AnsibleRunnerException(f'The playbook {playbook} is not a valid yaml file.')
                else:
                    self.args.append(playbook)
        invntory = kwargs.get('invntory')
        if invntory is not None and os.path.exists(invntory):
            self.args.append('-i')
            self.args.append(invntory)

        # verbose -v, -vv, -vvv, -vvvv
        verbose = kwargs.get('v')
        v = 0
        if verbose is not None:
            if isinstance(verbose, int):
                v = verbose
            elif isinstance(verbose, str):
                if verbose.isdigit():
                    v = int(verbose)
                else:
                    v = verbose.count('v')
        if v > 5:
            v = 5
        if v > 0:
            self.args.append('-' + 'v' * v)
        forks = kwargs.get('forks')
        if forks is not None and forks.isdigit():
            self.args.append(f'-f {forks}')
        limit = kwargs.get('subset')
        if limit is not None:
            self.args.append('-l')
            self.args.append(limit)

    def run(self):
        exit_code = 0
        pbex = PlaybookExecutor(self.playbooks,
                                self.invntory)
        result = pbex.run()
        tmp = {
            "ok": pbex.results_callback.host_ok,
            "failed": pbex.results_callback.host_failed,
            "unreachable": pbex.results_callback.host_unreachable,
        }
        history = History.objects.filter(pk='4345353').first()
        if not history:
            history = History.objects.create(
                task_id=2,
                status=2,
                run_time=human_datetime(),
                output=json.dumps(tmp)
            )
        else:
            history.output=json.dumps(tmp)
            history.save()
        return exit_code
