from abc import ABC, abstractmethod
from libs import Argument, JsonParser
from importlib import import_module



class Hander(object):
    def __init__(self, data):
        self.hand_obj = None
        self.data = data

    def parse(self):
        data, err = JsonParser(Argument("platform", type=str), Argument("feature", type=str)).parse(self.data)
        if err is not None:
            return data, err
        platform = data.get("platform")
        feature = data.get("feature")
        mod = import_module(f"apps.template.networks.{platform}.{feature}") 
        clss = getattr(mod, "Hander")
        self.hand_obj = clss(self.data)
        return self.hand_obj.parse()

    def render(self):
        if self.hand_obj is None:
            return None
        return self.hand_obj.render()


class Basic(ABC):
    arguments = {}

    def __init__(self, data):
        self.data = data
        self.form = None
        self.err = None

    def parse(self):
        args = []
        for key in self.arguments:
            args.append(Argument(key, **self.arguments[key]))
        self.form, self.err = JsonParser(*args).parse(self.data)
        return self.form, self.err

    @abstractmethod
    def render(self):
        pass
