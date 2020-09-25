
import React from 'react';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Col, Button, message } from 'antd';
import { ACEditor } from 'components';
import { http, cleanCommand } from 'libs';
import store from './store';

@observer
class ComForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      type: null,
      content: store.record['content'],
    }
  }

  handleSubmit = () => {
    this.setState({loading: true});
    const formData = this.props.form.getFieldsValue();
    formData['id'] = store.record.id;
    formData['content'] = cleanCommand(this.state.content);
    http.post('/api/template/generic/', formData)
      .then(res => {
        message.success('操作成功');
        store.formVisible = false;
        store.fetchRecords()
      }, () => this.setState({loading: false}))
  };

  handleAddZone = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: '添加模板类型',
      content: this.addZoneForm,
      onOk: () => {
        if (this.state.type) {
          store.types.push(this.state.type);
          this.props.form.setFieldsValue({'label': this.state.type})
        }
      },
    })
  };

  addZoneForm = (
    <Form>
      <Form.Item required label="模板类型">
        <Input onChange={val => this.setState({type: val.target.value})}/>
      </Form.Item>
    </Form>
  );

  render() {
    const info = store.record;
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑模板' : '新建模板'}
        onCancel={() => store.formVisible = false}
        confirmLoading={this.state.loading}
        onOk={this.handleSubmit}>
        <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <Form.Item required label="模板类型">
            <Col span={16}>
              {getFieldDecorator('label', {initialValue: info['label']})(
                <Select placeholder="请选择模板类型">
                  {store.types.map(item => (
                    <Select.Option value={item} key={item}>{item}</Select.Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col span={6} offset={2}>
              <Button type="link" onClick={this.handleAddZone}>添加类型</Button>
            </Col>
          </Form.Item>
          <Form.Item required label="模板名称">
            {getFieldDecorator('name', {initialValue: info['name']})(
              <Input placeholder="请输入模板名称"/>
            )}
          </Form.Item>
          <Form.Item required label="模板内容">
            <ACEditor
              mode="sh"
              value={this.state.content}
              onChange={val => this.setState({content: val})}

              height="300px"/>
          </Form.Item>
          <Form.Item label="备注信息">
            {getFieldDecorator('desc', {initialValue: info['desc']})(
              <Input.TextArea placeholder="请输入模板备注信息"/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ComForm)
