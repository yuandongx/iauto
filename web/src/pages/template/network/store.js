
import { observable } from "mobx";
import http from 'libs/http';

class Store {
  @observable records = [];
  @observable types = [];
  @observable record = {};
  @observable isFetching = false;
  @observable formFlag = null;
  @observable preViewResult = null;
  @observable f_name;
  @observable f_type;
  @observable submitData = {};

  fetchRecords = () => {
    this.isFetching = true;
    http.get('/api/template/network/')
      .then(({types, templates}) => {
        this.records = templates;
        this.types = types
      })
      .finally(() => this.isFetching = false)
  };

  showForm = (key) => {
    this.formFlag = key;
    /**this.record = key**/
  }
}

export default new Store()
