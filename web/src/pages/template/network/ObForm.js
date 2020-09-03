
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, Select, Col, Button, message } from 'antd';
import { ACEditor } from 'components';
import { http, cleanCommand } from 'libs';
import store from './store';

@observer
class ObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  render(){
    return(
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑地址对象' : '新建地址对象'}
        onCancel={() => store.formVisible = false}
        confirmLoading={this.state.loading}
        onOk={this.handleSubmit}>
        
      </Modal>
    );
  }
}
export default ObjectForm;