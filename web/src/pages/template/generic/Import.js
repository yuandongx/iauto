
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Upload, Icon, Button, Alert, message } from 'antd';

import http from 'libs/http';
import store from './store';


@observer
class ComImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileList: [],
    }
  }
   attrs = {
      action: '/api/template/upload/',
      // onChange: this.handleChange,
      multiple: true,
      headers: {'X-Token': localStorage.getItem('token')},
      // beforeUpload: this.beforeUpload,
    };
  handleChange = info => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    // fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList });
  };
  beforeUpload = file => {

    var re = /ya?ml$/;
    const isVaildFormat = (file.type === 'text/x-sh' || file.name.match(re)) ? true : false;
    if (!isVaildFormat) {
      message.error('You can only upload yml/yaml/sh file!');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('File must smaller than 3MB!');
    }
    return isVaildFormat && isLt3M;
  };
  handleSubmit = (e) => {
      this.setState({loading: true});
      var formData = new FormData();
      console.log(this.state.fileList);
      formData.append('files', this.state.fileList.map(file => {return file.name}));
      http.post('/api/template/upload-submit/', formData, {timeout: 120000})
        .then(
          res => {
            Modal.info({
                title: '导入结果',
                onOk: () => {store.importVisible = false},
                content:<> 
                {res['ok'].length > 0 && <Alert message={`${res['ok'].join(', ')} 上传成功`} type="success" showIcon />}
                {res['override'].length > 0 && <Alert message={`${res['override'].join(', ')} 已存在，覆盖上传成功`} type="warning" showIcon />}
                {res['fail'].length > 0 && <Alert message={`${res['fail'].join(', ')} 上传失败`} type="error" showIcon />}
                </>
            });
            store.fetchRecords()
          }
      ).finally(() => this.setState({loading: false}));
  }
  onCancel = file => {
      
  }
  render() {
    return (
      <Modal
        visible
        width={800}
        maskClosable={false}
        title="批量导入"
        okText="确定"
        onCancel={() => store.importVisible = false}
        confirmLoading={this.state.loading}
        okButtonProps={{disabled: !this.state.fileList.length}}
        onOk={this.handleSubmit}>
        <Alert closable showIcon type="info" message={null}
               style={{width: 600, margin: '0 auto 20px', color: '#31708f !important'}}
               description="导入需是文本文件,支持sh文本或ansible-playbook。"/>
        <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>

          <Form.Item required label="导入数据">
            <Upload {...this.attrs} beforeUpload={this.beforeUpload} onChange={this.handleChange}>
              <Button>
                <Icon type="upload"/> 点击上传
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default ComImport
