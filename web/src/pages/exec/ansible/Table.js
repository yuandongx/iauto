
import React from 'react';
import { observer } from 'mobx-react';
import { DeleteFilled,
         EditFilled,
         EyeTwoTone,
         PlayCircleTwoTone,
         CloseCircleTwoTone } from '@ant-design/icons';
import { Table, Tooltip, Divider, Modal, Tag, message } from 'antd';
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
      http.post('/api/exec/ansible/do_job/', {id: this.props.taskId, state: this.props.state === RUNNING ? 1 : 0 })
      .then(({success, msg}) => {
          console.log(success);
          console.log(msg);
      }).finally(() => this.props.onClick());
  };

  render(){
    return (
      <Tooltip placement="top" title={this.props.state === RUNNING ? '停止执行' : '开始任务'}>
       <LinkButton onClick={() => this.handleExecute()}>
         {this.props.state === RUNNING ? <CloseCircleTwoTone theme="twoTone" twoToneColor="#FF3030"/>:<PlayCircleTwoTone theme="twoTone"  twoToneColor="#52c41a"/>}
       </LinkButton>
    </Tooltip>
    );
    };
}


@observer
class ComTable extends React.Component {

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
        if (info['status'] === SUCCESS) {
          return <Tag color={COLORS[SUCCESS]}>{MESSAGE[SUCCESS]}</Tag>
        } else if (info['status'] === FAILED) {
          return <Tag color={COLORS[FAILED]}>{MESSAGE[FAILED]}</Tag>
        } else if (info['status'] === RUNNING) {
          return <Tag color={COLORS[RUNNING]}>{MESSAGE[RUNNING]}</Tag>
        } else if (info['status'] === WAITING)  {
          return <Tag color={COLORS[WAITING]}>{MESSAGE[WAITING]}</Tag>
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
          <LinkButton disabled={info["status"] === 3} onClick={() => store.showInfo(info)}><EyeTwoTone /></LinkButton>
        </Tooltip>
        <Divider type="vertical"/>
        <Tooltip placement="top" title='编辑任务'>
          <LinkButton onClick={() => store.showForm(info)}><EditFilled /></LinkButton>
        </Tooltip>
        <Divider type="vertical"/>
        <Tooltip placement="top" title='开始任务'>
        <StartButton state={info.status} taskId={info.id} onClick={() => this.handleExecute(info)}/>
        </Tooltip>
        <Divider type="vertical"/>
        <Tooltip placement="top" title='删除任务'>
          <LinkButton onClick={() => this.handleDelete(info)}><DeleteFilled /></LinkButton>
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
  componentDidMount() {
    store.fetchRecords();
    this.timerID = setInterval(
      () => store.fetchRecords(),
      10000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    let data = store.records;
    if (store.f_status !== undefined){
        data = data.filter(item => item["status"] === store.f_status).filter(item => item['is_active']);
    }
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
