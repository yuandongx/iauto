
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, Upload, Icon, Button, Tooltip, Alert } from 'antd';
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
      action: '/api/exec/template/import/',
      onChange: this.handleChange,
      multiple: true,
    };
  handleChange = info => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

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
            <Upload {...this.attrs} >
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
