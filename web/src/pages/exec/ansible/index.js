import React from 'react';
import { observer } from 'mobx-react';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Input, Select, Button } from 'antd';
import { SearchForm, AuthDiv, AuthCard } from 'components';
import ComTable from './Table';
import store from './store';

export default observer(function () {
  return (
    <AuthCard auth="exec.run_ansible.view">
      <SearchForm>
        <SearchForm.Item span={6} title="状态">
          <Select allowClear value={store.f_status} onChange={v => store.f_status = v} placeholder="请选择">
            <Select.Option value={0}>成功</Select.Option>
            <Select.Option value={1}>失败</Select.Option>
            <Select.Option value={2}>执行中</Select.Option>
            <Select.Option value={3}>待执行</Select.Option>
          </Select>
        </SearchForm.Item>
        <SearchForm.Item span={6} title="类型">
          <Select allowClear value={store.f_type} onChange={v => store.f_type = v} placeholder="请选择">
            {store.types.map(item => (
              <Select.Option value={item} key={item}>{item}</Select.Option>
            ))}
          </Select>
        </SearchForm.Item>
        <SearchForm.Item span={6} title="名称">
          <Input allowClear value={store.f_name} onChange={e => store.f_name = e.target.value} placeholder="请输入"/>
        </SearchForm.Item>
        <SearchForm.Item span={6}>
          <Button type="primary" icon={<SyncOutlined />} onClick={store.fetchRecords}>刷新</Button>
        </SearchForm.Item>
      </SearchForm>
      <AuthDiv auth="exec.ansible.add" style={{marginBottom: 16}}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => store.showForm()}>新建</Button>
      </AuthDiv>
      <ComTable/>
    </AuthCard>
  );
})
