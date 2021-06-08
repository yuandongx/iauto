
import { observable } from "mobx";
import http from 'libs/http';

class Store {
  @observable records = [];
  @observable hosts = [];
  @observable record = {};
  @observable isFetching = false;
  @observable formVisible = false;
  @observable timeRangeVisible = false;

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
    this.record = info;
    this.fetchHosts();
  }
  
  fetchHosts = () => {
    this.isFetching = true;
    return http.get('/api/host/')
      .then(({hosts, }) => {
        this.hosts = hosts;
        console.log(hosts);
      })
      .finally(() => this.isFetching = false)
  };

  setTimeRangeVisible = (flag) => {
      this.timeRangeVisible = flag;
      console.log(flag);
  }

}

export default new Store()
