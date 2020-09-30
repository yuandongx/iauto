
import React from 'react';
import { observer } from 'mobx-react';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Select, Button } from 'antd';
import { SearchForm, AuthDiv, AuthCard } from 'components';
import ComTable from './Table';
import store from './store';

export default observer(function () {
  const filter = (types) => {
      var tmp = [];
      var result = []
      for (let i=0;i<types.length; i++){
          if (!tmp.includes(types[i].name)){
              tmp.push(types[i].name);
              result.push(types[i]);
          }
      }
      return result;
  }
  return (
    <AuthCard auth="exec.template.view">
      <SearchForm>
        <SearchForm.Item span={8} title="模板类型">
          <Select allowClear value={store.f_type} onChange={v => store.f_type = v} placeholder="请选择">
            {store.types.map(item => (
              <Select.Option value={item.name} key={item.name}>{item.name}</Select.Option>
            ))}
          </Select>
        </SearchForm.Item>
        <SearchForm.Item span={8} title="模版名称">
          <Input allowClear value={store.f_name} onChange={e => store.f_name = e.target.value} placeholder="请输入"/>
        </SearchForm.Item>
        <SearchForm.Item span={8}>
          <Button type="primary" icon={<SyncOutlined />} onClick={store.fetchRecords}>刷新</Button>
        </SearchForm.Item>
      </SearchForm>
      <AuthDiv auth="exec.template.add" style={{marginBottom: 16}}>
          {filter(store.types).map(item=>(<Button type="link" key={item.name} onClick={() => store.showForm(item.name)}>{item.description}</Button>))}
      </AuthDiv>
      <ComTable/>
    </AuthCard>
  );
})
