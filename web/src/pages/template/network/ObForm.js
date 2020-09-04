
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, Select, Col, Button, message, Radio, Icon } from 'antd';
import { ACEditor } from 'components';
import { http, cleanCommand } from 'libs';
import store from './store';
const { Option } = Select;

class DataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      radioValue: 1,
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleSelectChange = value => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };
  onRadioChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      radioValue: e.target.value,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.state.radioValue === 1);
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
                rules: [{ required: true, message: 'Please input your note!' }],
              })(
              <Input placeholder="请输入IP地址"/>
            )}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('object_type', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Radio.Group onChange={this.onRadioChange}>
                <Radio value={1}>主机地址</Radio>
                <Radio value={2}>地址范围</Radio>
                <Radio value={3}>地址子网</Radio>
              </Radio.Group>)}
        </Form.Item>
        {this.state.radioValue === 1 && <Form.Item required label="IP地址">
            {getFieldDecorator('name',  {
                rules: [{ required: true, message: 'Please input your note!' }],
              })(
              <Input placeholder="请输入IP地址"/>
            )}
          </Form.Item>}
        {this.state.radioValue === 2 && <Form.Item required label="IP地址范围">
            <Input.Group compact>
              <Form.Item
                name={['address', 'province']}
                rules={[{ required: true, message: 'Province is required' }]}
              >
                {getFieldDecorator('name',  {
                    rules: [{ required: true, message: 'Please input your note!' }],
                  })(
                  <Input placeholder="请输入IP地址"/>
                )}
              </Form.Item>
              <Icon type="line" style={{ fontSize: '20px', color: '#08c', margin: '10px' }}/>
              <Form.Item
                name={['address', 'street']}
                rules={[{ required: true, message: 'Street is required' }]}
              >
               {getFieldDecorator('name',  {
                    rules: [{ required: true, message: 'Please input your note!' }],
                  })(
                  <Input placeholder="请输入IP地址"/>
                )}
              </Form.Item>
            </Input.Group>
        </Form.Item>}
        {this.state.radioValue === 3 && <Form.Item required label="IP地址范围">
            {getFieldDecorator('name',  {
                    rules: [{ required: true, message: 'Please input your note!' }],
                  })(
                  <Input placeholder="请输入IP地址"/>
                )}
        </Form.Item>}
        {this.state.radioValue === 3 && <Form.Item required label="IP地址范围">
            {getFieldDecorator('name',  {
                    rules: [{ required: true, message: 'Please input your note!' }],
                  })(
                  <Input placeholder="请输入子网掩码"/>
                )}
        </Form.Item>}
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

@observer
class ObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
        onCancel={() => store.formVisible = false}
        confirmLoading={this.state.loading}
        onCancel={() => store.formFlag = null}
        onOk={this.handleSubmit}
        >
        <DForm />
      </Modal>
    );
  }
}
export default ObjectForm;