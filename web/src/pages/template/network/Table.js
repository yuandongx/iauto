
import React from 'react';
import { observer } from 'mobx-react';
import { Table,
		 Divider,
		 Modal,
		 Tooltip,
		 message } from 'antd';
import { DeleteFilled,
         EyeTwoTone,
         RocketFilled } from '@ant-design/icons';
import http from 'libs/http';
import store from './store';
import { LinkButton } from "components";
import showInfo from "./detaile";

@observer
class ComTable extends React.Component {
  componentDidMount() {
    store.fetchRecords()
  }

  columns = [{
    title: '模版名称',
    dataIndex: 'name',
  }, {
    title: '模版类型',
    dataIndex: 'type',
  }, {
    title: '模版内容',
    render: text => text.config_lines,
    ellipsis: true
  }, {
    title: '描述信息',
    dataIndex: 'desc',
    ellipsis: true
  }, {
    title: '操作',
    render: info => (
      <span>
		<Tooltip placement="top" title='详情'>
			<LinkButton auth="exec.template.edit" onClick={() => showInfo(info.id)}><EyeTwoTone /></LinkButton>
		</Tooltip>
        <Divider type="vertical"/>
		<Tooltip placement="top" title='创建任务'>
			<LinkButton auth="exec.template.del" onClick={() => this.createTask(info.id)}><RocketFilled /></LinkButton>
		</Tooltip>
        <Divider type="vertical"/>
		<Tooltip placement="top" title='删除'>
			<LinkButton auth="exec.template.del" onClick={() => this.handleDelete(info)}><DeleteFilled /></LinkButton>
		</Tooltip>
      </span>
    )
  }];

  createTask = info => {}

  handleDelete = (text) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除【${text['name']}】?`,
      onOk: () => {
        return http.delete('/api/template/network/', {params: {id: text.id}})
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
      data = data.filter(item => item['label'].toLowerCase().includes(store.f_type.toLowerCase()))
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
      </React.Fragment>
    )
  }
}

export default ComTable
