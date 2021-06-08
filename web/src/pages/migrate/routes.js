
import { makeRoute } from "../../libs/router";
import Database from './db';
import File from './file';


export default [
  makeRoute('/database', Database),
  makeRoute('/file', File),
]
