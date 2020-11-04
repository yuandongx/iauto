
import { observable } from "mobx";
import http from 'libs/http';
import platforms from "./platforms"

class Store {
  @observable records = [];
  @observable types = [];
  @observable record = {};
  @observable isFetching = false;
  @observable showDetileForm = null;
  @observable f_name;
  @observable f_type;
  @observable result_data = null;
  @observable counter = {};

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
  initCount = () => {
    for(let j = 0; j++; j < platforms.length) {
      let obj = {};
      for (let i; i++; i < platforms[j].features.length){
        obj[platforms[j].features[j].name] = 0;
      }
      this.counter[platforms[j].platform] = obj;
    }
  }
  count = (platform, type, number) => {
    if (this.counter[platform] === undefined) {
      this.counter[platform] = {};
    } 
    if (this.counter[platform][type] === undefined) {
      this.counter[platform][type] = 0;
    } else {
      this.counter[platform][type] = number;
    }
  }
  getCount = (platform, type) => {
    if (this.counter[platform] === undefined) {
      console.log("this.counter[platform]", this.counter[platform])
      return 0;
    }
    if (this.counter[platform][type] === undefined) {
      console.log("this.counter[platform][type]", this.counter[platform][type]);
      return 0;
    } else {
      console.log("this.counter[platform][type]", this.counter[platform][type]);
      return this.counter[platform][type];
    }
  }
}

export default new Store()
