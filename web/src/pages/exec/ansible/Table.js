
import React from 'react';
import { observer } from 'mobx-react';
import { Table, Tooltip, Divider, Modal, Tag, Icon, message } from 'antd';
import ComForm from './Form';
import http from 'libs/http';
import store from './store';
import { LinkButton } from "components";
import Info from './Info';
import Record from './Record';

const SUCCESS = 0
const FAILED = 1
const RUNNING = 2
const WAITING = 3
const COLORS = ['green', 'red', "blue", 'orange'];
const MESSAGE = ['执行成功', '执行失败', "执行中", "待执行"];

class StartButton extends React.Component {

  handleExecute = () => {
      this.props.onClick();
      this.setState({taskState: this.props.state === RUNNING ? 1 : 0});
      http.post('/api/exec/ansible/do_job/', {id: this.props.taskId, state: this.props.state})
      .then(({success, msg}) => {
          console.log(success);
          console.log(msg);
      });
  };

  render(){

    return(<Tooltip placement="top" title={this.props.state === 0 ? '开始任务': '停止执行'}>
            <LinkButton onClick={() => this.handleExecute()}>
              <Icon type={this.props.state === RUNNING ? "close-circle":"play-circle"}
              twoToneColor={this.props.state === RUNNING ? "#FF3030":"#52c41a"}
              theme="twoTone" />
              </LinkButton>
            </Tooltip>);
    };
}


@observer
class ComTable extends React.Component {

  componentDidMount() {
    store.fetchRecords();
  }

  columns = [{
    title: '序号',
    key: 'series',
    render: (_, __, index) => index + 1,
    width: 80,
  }, {
    title: '任务名称',
    dataIndex: 'name',
  }, {
    title: '任务类型',
    dataIndex: 'type',
  }, {
    title: '最新状态',
    render: info => {
      if (info.is_active) {
        if (info['status'] === 0) {
          return <Tag color={COLORS[0]}>{MESSAGE[0]}</Tag>
        } else if (info['status'] === 1) {
          return <Tag color={COLORS[1]}>{MESSAGE[1]}</Tag>
        } else if (info['status'] === 2) {
          return <Tag color={COLORS[2]}>{MESSAGE[2]}</Tag>
        } else if (info['status'] === 3)  {
          return <Tag color={COLORS[3]}>{MESSAGE[3]}</Tag>
        }
      } else {
        return <Tag>未执行</Tag>
      }
    },
  }, {
    title: '更新于',
    dataIndex: 'latest_run_time_alias',
    sorter: (a, b) => a.latest_run_time.localeCompare(b.latest_run_time)
  }, {
    title: '描述信息',
    dataIndex: 'desc',
    ellipsis: true
  }, {
    title: '操作',
    width: 180,
    render: info => (
      <span>
        <Tooltip placement="top" title='查看详情'>
          <LinkButton disabled={!info['latest_run_time']} onClick={() => store.showInfo(info)}><Icon type="eye" theme="twoTone" /></LinkButton>
        </Tooltip>
        <Divider type="vertical"/>
        <Tooltip placement="top" title='编辑任务'>
          <LinkButton onClick={() => store.showForm(info)}><Icon type="edit" theme="filled" /></LinkButton>
        </Tooltip>
        <Divider type="vertical"/>
        <Tooltip placement="top" title='开始任务'>
        <StartButton state={info.status} taskId={info.id} onClick={() => this.handleExecute(info)}/>
        </Tooltip>
        <Divider type="vertical"/>
        <Tooltip placement="top" title='删除任务'>
          <LinkButton onClick={() => this.handleDelete(info)}><Icon type="delete" theme="filled" /></LinkButton>
        </Tooltip>
      </span>
    )
  }];

  handleExecute = (text) => {
    store.fetchRecords();
  };

  handleDelete = (text) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除【${text['name']}】?`,
      onOk: () => {
        return http.delete('/api/exec/ansible/', {params: {id: text.id}})
          .then(() => {
            message.success('删除成功');
            store.fetchRecords()
          })
      }
    })
  };

  render() {
    let data = store.records;
    if (store.f_status !== undefined){
        data = data.filter(item => item["status"] === store.f_status).filter(item => item['is_active']);
    }
    /**if (store.f_status !== undefined) {
      if (store.f_status === -3) {
        data = data.filter(item => !item['is_active'])
      } else if (store.f_status === -2) {
        data = data.filter(item => item['is_active'])
      } else if (store.f_status === -1) {
        data = data.filter(item => item['is_active'] && !item['latest_status_alias'])
      } else {
        data = data.filter(item => item['latest_status'] === store.f_status)
      }
    }
    if (store.f_status === 0) data = data.filter(item => item['is_active']);**/
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
        {store.infoVisible && <Info/>}
        {store.recordVisible && <Record/>}
      </React.Fragment>
    )
  }
}

export default ComTable
