
import { makeRoute } from "../../libs/router";
import Generic from './generic';
import Netwok from './network';


export default [
  makeRoute('/generic', Generic),
  makeRoute('/network', Netwok),
]
