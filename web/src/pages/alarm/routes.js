
import { makeRoute } from 'libs/router';
import Alarm from './alarm';
import Contact from './contact';
import Group from './group';


export default [
  makeRoute('/db', Alarm),
  makeRoute('/file', Contact),
  makeRoute('/group', Group),
]
