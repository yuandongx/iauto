
import { makeRoute } from "../../libs/router";
import Schedule from './schedule';
import Task from './task';
import Tpltask from './ansible';


export default [
  makeRoute('/schedule', Schedule),
  makeRoute('/task', Task),
  makeRoute('/ansible', Tpltask),
]
