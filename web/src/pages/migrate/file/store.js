
import { observable } from "mobx";
import http from 'libs/http';

class Store {
  @observable records = [];
  @observable types = [];
  @observable record = {};
  @observable isFetching = false;
  @observable formVisible = false;
  // @observable importVisible = false;

  @observable origin_name;
  @observable backup_name;

  fetchRecords = () => {
    this.isFetching = true;
    http.get('/api/template/generic/')
      .then(({types, templates}) => {
        this.records = templates;
        this.types = types
      })
      .finally(() => this.isFetching = false)
  };

  showForm = (info = {}) => {
    this.formVisible = true;
    this.record = info
  }
}

export default new Store()
