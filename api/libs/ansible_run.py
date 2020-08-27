import os
import subprocess
from yaml import load
try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader

IMPORTED = False
try:
    from ansible.cli.playbook import PlaybookCLI
    from ansible.errors import AnsibleError, AnsibleOptionsError, AnsibleParserError
    from ansible.module_utils._text import to_text
    IMPORTED = True
except ImportError:
    IMPORTED = False
    pass


class AnsibleRunnerException(Exception):
    pass


class Runner(object):
    def __init__(self, **kwargs):
        self.args = ['ansible-playbook']
        self.init_args(**kwargs)
        self.callback = None

    def init_args(self, *args, **kwargs):
        playbook = kwargs.get('playbook')
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
        self.callback = kwargs.get('callback')
        forks = kwargs.get('forks')
        if forks is not None and forks.isdigit():
            self.args.append(f'-f {forks}')
        limit = kwargs.get('subset')
        if limit is not None:
            self.args.append(f'-l {subset}')

    def run_v1(self):
        exit_code = 0
        try:
            try:
                self.args = [to_text(a, errors='surrogate_or_strict') for a in self.args]
            except UnicodeError:
                exit_code = 6
            else:
                print(' '.join(self.args))
                cli = PlaybookCLI(self.args, callback=self.callback)
                exit_code = cli.run()
        except AnsibleOptionsError:
            exit_code = 5
        except AnsibleParserError:
            exit_code = 4
        except AnsibleError:
            exit_code = 3
        except Exception as e:
            print(e)
            exit_code = 2
        print(exit_code)
        return exit_code

    def run_v2(self):
        exit_code = 0
        try:
            try:
                self.args = [to_text(a, errors='surrogate_or_strict') for a in self.args]
            except UnicodeError:
                exit_code = 6
            else:
                p = subprocess.Popen(
                        ' '.join(self.args),
                        shell=True,
                        stdin=subprocess.PIPE,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                outs, errors = p.communitcate()
        except Exception as e:
            exit_code = 1
            print(e)
        return exit_code

    def run(self):
        code = 0
        if IMPORTED:
            code = self.run_v1()
        else:
            code = self.run_v2()
        return code


def ansible_run(**kwargs):
    cli = Runner(**kwargs)
    return cli.run()


if __name__ == '__main__':
    print(ansible_run(playbook='/www/api/libs/test.yml',
                      v=4,
                      invntory='/www/api/libs/inventory'))