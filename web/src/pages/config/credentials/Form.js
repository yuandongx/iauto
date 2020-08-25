
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, message } from 'antd';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import http from 'libs/http';
import store from './store';

@observer
class ComForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  handleSubmit = () => {
    this.setState({loading: true});
    const formData = this.props.form.getFieldsValue();
    formData['id'] = store.record.id;
    http.post('/api/config/credentials/', formData)
      .then(res => {
        message.success('操作成功');
        store.formVisible = false;
        store.fetchRecords()
      }, () => this.setState({loading: false}))
  };

  render() {
    const info = store.record;
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑访问凭证' : '新建访问凭证'}
        onCancel={() => store.formVisible = false}
        confirmLoading={this.state.loading}
        onOk={this.handleSubmit}>
        <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <Form.Item required label="访问凭证名称">
            {getFieldDecorator('name', {initialValue: info['name']})(
              <Input placeholder="请输入访问凭证名称，例如：web.pwd"/>
            )}
          </Form.Item>
          <Form.Item required label="请输入密码">
            {getFieldDecorator('key', {initialValue: info['key']})(
              <Input.Password placeholder="请输入密码"  />
            )}
          </Form.Item>
          <Form.Item label="备注信息">
            {getFieldDecorator('desc', {initialValue: info['desc']})(
              <Input.TextArea placeholder="请输入备注信息"/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ComForm)
