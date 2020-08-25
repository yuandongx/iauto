
import { makeModuleRoute } from "./libs/router";

import welcomeRoues from './pages/welcome/routes';
import homeRoutes from './pages/home/routes';
import hostRoutes from './pages/host/routes';
import systemRoutes from './pages/system/routes';
import execRoutes from './pages/exec/routes';
import templateRoutes from './pages/template/routes';
import monitorRoutes from './pages/monitor/routes';
import alarmRoutes from './pages/alarm/routes';
import configRoutes from './pages/config/routes';
import deployRoutes from './pages/deploy/routes';


export default [
  makeModuleRoute('/welcome', welcomeRoues),
  makeModuleRoute('/home', homeRoutes),
  makeModuleRoute('/host', hostRoutes),
  makeModuleRoute('/system', systemRoutes),
  makeModuleRoute('/exec', execRoutes),
  makeModuleRoute('/template', templateRoutes),
  makeModuleRoute('/monitor', monitorRoutes),
  makeModuleRoute('/alarm', alarmRoutes),
  makeModuleRoute('/config', configRoutes),
  makeModuleRoute('/deploy', deployRoutes),
]
