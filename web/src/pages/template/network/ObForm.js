
import http from 'libs/http';
import React from 'react';
import { observer } from 'mobx-react';
import { LineOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Collapse, Button, Radio } from 'antd';

import store from './store';
const { Option } = Select;
const { Panel } = Collapse;
class DataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      radioValue: 1,
      preViewConfig: null,
    }
  }
  handleSubmit = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    const formData = this.props.form.getFieldsValue();
    formData['preview'] = true;
    formData['feature'] = "object";
    http.post('/api/template/network/', formData)
      .then(res => {
        console.log("send ok and receive:", res);
        this.props.onClick(res);
      }, () => this.setState({loading: false}))
  };

  handleSelectChange = value => {
    console.log(value);
  };
  onRadioChange = e => {
    this.setState({
      radioValue: e.target.value,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
        <Form.Item label="设备类型">
          {getFieldDecorator('platform', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <Select
              placeholder="选择设备类型..."
              onChange={this.handleSelectChange}
            >
              <Option value="asa">asa</Option>
              <Option value="topsec">topsec</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item required label="对象名称">
            {getFieldDecorator('name',  {
                rules: [{ required: true, message: '请输入对象名称!' }],
              })(
              <Input placeholder="请输入对象名称!"/>
            )}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('kind', {
            rules: [{ required: true, message: '请选择要配置的对象类型!' }],
          })(<Radio.Group onChange={this.onRadioChange}>
                <Radio value={1}>主机地址</Radio>
                <Radio value={2}>地址范围</Radio>
                <Radio value={3}>地址子网</Radio>
              </Radio.Group>)}
        </Form.Item>
        {this.state.radioValue === 1 && <Form.Item required label="IP地址">
            {getFieldDecorator('hostip',  {
                rules: [{ required: true, message: '请输入主机地址!' }],
              })(
              <Input placeholder="请输入IP地址"/>
            )}
          </Form.Item>}
        {this.state.radioValue === 2 && <Form.Item required label="IP地址范围">
            <Input.Group compact>
              <Form.Item
                rules={[{ required: true, message: '请输入起始IP地址!' }]}
              >
                {getFieldDecorator('start_ip',  {
                    rules: [{ required: true, message: '请输入起始IP地址!' }],
                  })(
                  <Input placeholder="请输入IP地址"/>
                )}
              </Form.Item>
              <LineOutlined style={{ fontSize: '20px', color: '#08c', margin: '10px' }} />
              <Form.Item
                rules={[{ required: true, message: '请输入结束IP地址!' }]}
              >
               {getFieldDecorator('end_ip',  {
                    rules: [{ required: true, message: '请输入结束IP地址!' }],
                  })(
                  <Input placeholder="请输入IP地址"/>
                )}
              </Form.Item>
            </Input.Group>
        </Form.Item>}
        {this.state.radioValue === 3 && <Form.Item required label="IP地址范围">
            {getFieldDecorator('subnet_ip',  {
                    rules: [{ required: true, message: '请输入子网IP!' }],
                  })(
                  <Input placeholder="请输入IP地址"/>
                )}
        </Form.Item>}
        {this.state.radioValue === 3 && <Form.Item required label="IP地址范围">
            {getFieldDecorator('subnet_mask',  {
                    rules: [{ required: true, message: '请输入子网掩码!' }],
                  })(
                  <Input placeholder="请输入子网掩码"/>
                )}
        </Form.Item>}
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" onClick={this.handleSubmit}>
            配置预览
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const pre = {'white-space': 'pre-line'}
@observer
class ObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      result: null,
    }
  }
  render(){
    const DForm = Form.create({ name: 'horizontal_login' })(DataForm);
    return(
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑地址对象' : '新建地址对象'}
        confirmLoading={this.state.loading}
        onCancel={() => store.formFlag = null}
        onOk={this.handleSubmit}
        >
        <DForm onClick={(data) => this.setState({result: data})}/>
      {this.state.result != null && <Collapse>
            <Panel header={this.state.result.name} key="1">
             <p className={pre}>{this.state.result.lines}</p>
            </Panel>
      </Collapse>}
      </Modal>
    );
  }
}
export default ObjectForm;