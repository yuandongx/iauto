
import React from 'react';
import { observer } from 'mobx-react';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { SearchForm, AuthDiv, AuthCard } from 'components';
import ComTable from './Table';
import store from './store';

export default observer(function () {
  return (
    <AuthCard auth="exec.template.view">
      <SearchForm>
        <SearchForm.Item span={8} title="源数据库名">
          <Input allowClear value={store.origin_name} onChange={e => store.origin_name = e.target.value} placeholder="请输入"/>
        </SearchForm.Item>
        <SearchForm.Item span={8} title="备份数据库名">
          <Input allowClear value={store.backup_name} onChange={e => store.backup_name = e.target.value} placeholder="请输入"/>
        </SearchForm.Item>
        <SearchForm.Item span={8}>
          <Button type="primary" icon={<SyncOutlined />} onClick={store.fetchRecords}>刷新</Button>
        </SearchForm.Item>
      </SearchForm>
      <AuthDiv auth="exec.template.add" style={{marginBottom: 16}}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => store.showForm()}>新建</Button>
      </AuthDiv>
      <ComTable/>
    </AuthCard>
  );
})
