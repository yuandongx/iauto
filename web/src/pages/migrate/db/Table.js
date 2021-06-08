
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { Table, Divider, Modal, message, Menu, Dropdown } from 'antd';
import ComForm from './Form';
import ComImport from './Import';
import http from 'libs/http';
import store from './store';
import { LinkButton } from "components";

@observer
class ComTable extends React.Component {
  componentDidMount() {
    store.fetchRecords()
  }
  moreMenus = (info) => (
    <Menu>
      <Menu.Item>
        <LinkButton onClick={() => this.handleTest(info)}>策略详情</LinkButton>
      </Menu.Item>
      <Menu.Item>
        <LinkButton auth="schedule.schedule.edit" onClick={() => this.handleActive(info)}>编辑修改</LinkButton>
      </Menu.Item>
      <Menu.Item>
        <LinkButton onClick={() => store.showRecord(info)}>历史记录</LinkButton>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item>
        <LinkButton auth="schedule.schedule.del" onClick={() => this.handleDelete(info)}>删除</LinkButton>
      </Menu.Item>
    </Menu>
  );
  columns = [{
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '源数据库',
    dataIndex: 'type',
  }, {
    title: '目的数据库',
    dataIndex: 'type',
  },{
    title: '迁移策略',
    dataIndex: 'policy',
  }, {
    title: '创建人',
    dataIndex: 'create_by',
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    ellipsis: true
  }, {
    title: '状态',
    dataIndex: 'status',
  }, {
    title: '操作',
    render: info => (
      <span>
        <LinkButton auth="exec.template.edit" onClick={() => store.showForm(info)}>执行</LinkButton>
        <Divider type="vertical"/>
        <Dropdown overlay={() => this.moreMenus(info)} trigger={['click']}>
          <LinkButton>
            更多 <DownOutlined />
          </LinkButton>
        </Dropdown>
      </span>
    )
  }];

  handleDelete = (text) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除【${text['name']}】?`,
      onOk: () => {
        return http.delete('/api/template/generic/', {params: {id: text.id}})
          .then(() => {
            message.success('删除成功');
            store.fetchRecords()
          })
      }
    })
  };

  render() {
    let data = store.records;
    if (store.f_name) {
      data = data.filter(item => item['name'].toLowerCase().includes(store.f_name.toLowerCase()))
    }
    if (store.f_type) {
      data = data.filter(item => item['type'].toLowerCase().includes(store.f_type.toLowerCase()))
    }
    return (
      <React.Fragment>
        <Table
          rowKey="id"
          loading={store.isFetching}
          dataSource={data}
          pagination={{
            showSizeChanger: true,
            showLessItems: true,
            hideOnSinglePage: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          columns={this.columns}/>
        {store.formVisible && <ComForm/>}
        {store.importVisible && <ComImport/>}
      </React.Fragment>
    )
  }
}
export default ComTable
