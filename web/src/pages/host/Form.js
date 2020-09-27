
import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from "mobx";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Row, Col, Button, message, Tabs, Table, Checkbox } from 'antd';
import http from 'libs/http';
import store from './store';

const { TabPane } = Tabs;
@observer
class ComForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      password: null,
      addZone: null,
      editZone: store.record.zone,
      becomeChecked: false,
      becomeUser: null,
      becomeMethod: null,
      becomePassword: null,
    }
  }

  handleSubmit = () => {
    this.setState({loading: true});
    const formData = this.props.form.getFieldsValue();
    formData['id'] = store.record.id;
    store.fetchPwdRecords();
    http.post('/api/host/', formData)
      .then(res => {
        if (res === 'auth fail' || res === 'Password is required') {
          this.setState({loading: false});
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '首次验证请输入密码',
            content: this.confirmForm(),
            onOk: () => this.handleConfirm(formData),
          })
        } else {
          message.success('操作成功');
          store.formVisible = false;
          store.fetchRecords()
        }
      }, () => this.setState({loading: false}))

  };

  handleConfirm = (formData) => {
    if (this.state.password) {
      formData['password'] = this.state.password;
      return http.post('/api/host/', formData).then(res => {
        message.success('验证成功');
        store.formVisible = false;
        store.fetchRecords()
      })
    }
    message.error('请输入授权密码')
  };

  columns = [
      {title: '序号', key: 'series', render: (_, __, index) => index + 1,},
      {title: "凭证名称", dataIndex: "name"},
      {title: "描述信息", dataIndex: "decription"},
    ];
  onSelectChange = (record, selected, selectedRows) => {
      this.setState({password: record});
  };
  onCheckboxChange = (e) => {}
  confirmForm = () => {
    let data = toJS(store.pwdRecords).map(item => {return {key: item.id, name: item.name, decription: item.desc}});
    return (<Tabs defaultActiveKey="1" >
              <TabPane tab="新输入密码" key="1">
                  <Form>
                    <Form.Item label="授权密码">
                      <Input.Password onChange={val => this.setState({password: {password: val.target.value}})}/>
                    </Form.Item>
                    <Form.Item >
                      <Checkbox checked={this.state.becomeChecked} onChange={this.onCheckboxChange}>
                        升级权限
                      </Checkbox>
                    </Form.Item>
                  </Form>
              </TabPane>
              <TabPane tab="已有访问凭证" key="2">
                <Table rowSelection={{type: "radio", onSelect: this.onSelectChange}} dataSource={data} columns={this.columns} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />,
              </TabPane>
            </Tabs>);
    };

  handleAddZone = () => {
    this.setState({zone: ''}, () => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: '添加主机类别',
        content: (
          <Form>
            <Form.Item required label="主机类别">
              <Input onChange={e => this.setState({addZone: e.target.value})}/>
            </Form.Item>
          </Form>
        ),
        onOk: () => {
          if (this.state.addZone) {
            store.zones.push(this.state.addZone);
            this.props.form.setFieldsValue({'zone': this.state.addZone})
          }
        },
      })
    });
  };

  handleEditZone = () => {
    this.setState({zone: store.record.zone}, () => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: '编辑主机类别',
        content: (
          <Form>
            <Form.Item required label="主机类别" help="该操作将批量更新所有属于该类别的主机并立即生效，如过只是想修改单个主机的类别请使用添加类别或下拉框选择切换类别。">
              <Input defaultValue={store.record.zone} onChange={e => this.setState({editZone: e.target.value})}/>
            </Form.Item>
          </Form>
        ),
        onOk: () => http.patch('/api/host/', {id: store.record.id, zone: this.state.editZone})
          .then(res => {
            message.success(`成功修改${res}条记录`);
            store.fetchRecords();
            this.props.form.setFieldsValue({'zone': this.state.editZone})
          })
      })
    });
  };

  render() {
    const info = store.record;
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑主机' : '新建主机'}
        okText="验证"
        onCancel={() => store.formVisible = false}
        confirmLoading={this.state.loading}
        onOk={this.handleSubmit}>
        <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <Form.Item required label="主机类别">
          <Row>
            <Col span={14}>
              {getFieldDecorator('zone', {initialValue: info['zone']})(
                <Select placeholder="请选择主机类别/区域/分组">
                  {store.zones.map(item => (
                    <Select.Option value={item} key={item}>{item}</Select.Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col span={4} offset={1}>
              <Button type="link" onClick={this.handleAddZone}>添加类别</Button>
            </Col>
            <Col span={4} offset={1}>
              <Button type="link" onClick={this.handleEditZone}>编辑类别</Button>
            </Col>
            </Row>
          </Form.Item>
          <Form.Item required label="主机名称">
            {getFieldDecorator('name', {initialValue: info['name']})(
              <Input placeholder="请输入主机名称"/>
            )}
          </Form.Item>
          <Form.Item required label="连接地址" style={{marginBottom: 0}}>
            <Form.Item style={{display: 'inline-block', width: 'calc(30%)'}}>
              {getFieldDecorator('username', {initialValue: info['username']})(
                <Input addonBefore="ssh" placeholder="用户名"/>
              )}
            </Form.Item>
            <Form.Item style={{display: 'inline-block', width: 'calc(40%)'}}>
              {getFieldDecorator('hostname', {initialValue: info['hostname']})(
                <Input addonBefore="@" placeholder="主机名/IP"/>
              )}
            </Form.Item>
            <Form.Item style={{display: 'inline-block', width: 'calc(30%)'}}>
              {getFieldDecorator('port', {initialValue: info['port']})(
                <Input addonBefore="-p" placeholder="端口"/>
              )}
            </Form.Item>
          </Form.Item>
          <Form.Item label="备注信息">
            {getFieldDecorator('desc', {initialValue: info['desc']})(
              <Input.TextArea placeholder="请输入主机备注信息"/>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{span: 14, offset: 6}}>
            <span role="img" aria-label="notice">⚠️ 首次验证时需要输入登录用户名对应的密码，并存储该密码作为后续访问凭证。</span>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ComForm)
