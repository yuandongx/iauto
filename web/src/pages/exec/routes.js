
import { makeRoute } from "../../libs/router";
import Schedule from './schedule';
import Task from './task';
import Tpltask from './tpl_task';


export default [
  makeRoute('/schedule', Schedule),
  makeRoute('/task', Task),
  makeRoute('/tpl_task', Tpltask),
]
