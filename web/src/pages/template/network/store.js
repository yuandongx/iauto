
import { observable } from "mobx";
import http from 'libs/http';

class Store {
  @observable records = [];
  @observable types = [];
  @observable record = {};
  @observable isFetching = false;
  @observable showDetileForm = null;
  @observable f_name;
  @observable f_type;
  @observable result_data = null;

  fetchRecords = () => {
    this.isFetching = true;
    http.get('/api/template/network/')
      .then(({types, templates}) => {
        this.records = templates;
        this.types = types
      })
      .finally(() => this.isFetching = false)
  };

  showDetaileForm = (key) => {
    this.showDetileFlag = key;
  }
  saveData = (ob) => {
    this.result_data = ob;
  }

}

export default new Store()
