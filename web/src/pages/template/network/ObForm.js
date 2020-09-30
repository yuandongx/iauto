/***
*使用函数组件，目的是为了使用Form.useForm,组拆分
***/
import http from 'libs/http';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { LineOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Collapse, Button, Radio, Typography, Form } from 'antd';
import store from './store';
const { Option } = Select;
const { Panel } = Collapse;

const { Paragraph, Text } = Typography;
const Txt =({preViewResult})=> {
    console.log(preViewResult)
      return(<>
        {(preViewResult !== null && preViewResult !== undefined && preViewResult.lines !== undefined) && <Collapse>
            <Panel header={"预览配置命令行"} key="1">
             <Paragraph>{preViewResult.lines.map((item, index)=>(<Text key={index}>{item}<br/></Text>))}</Paragraph>
        </Panel>
      </Collapse>}
      </>);
}

const TheForm =({form, doSubmit})=>{
    const [radioValue, setRadioValue] = useState(1);
    const radioChange=(e)=>{
        setRadioValue(e.target.value);
    }
    return (
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="设备类型" name='platform' rules={[{ required: true, message: '请选择设备类型' }]}>
            <Select placeholder="选择设备类型..." onChange={(v)=>form.setFieldsValue({platform: v})}>
              <Option value="asa">asa</Option>
              <Option value="topsec">topsec</Option>
            </Select>,
        </Form.Item>
        <Form.Item required
            label="对象名称"
            name="name"
            rules={[{ required: true, message: '请输入对象名称!' }]}>
              <Input placeholder="请输入对象名称!"/>
        </Form.Item>
        <Form.Item label="类型" name="kind" rules={[{ required: true, message: '请选择要配置的对象类型!' }]}>
          <Radio.Group onChange={(e)=>radioChange(e)} value={radioValue}>
                <Radio value={1}>主机地址</Radio>
                <Radio value={2}>地址范围</Radio>
                <Radio value={3}>地址子网</Radio>
              </Radio.Group>
        </Form.Item>
        {radioValue === 1 && <Form.Item required label="IP地址" name="hostip" rules={[{ required: true, message: '请输入主机地址!' }]}>
            <Input placeholder="请输入IP地址"/>
          </Form.Item>}
        {radioValue === 2 && <Form.Item required label="IP地址范围">
            <Input.Group compact>
              <Form.Item
                name="start_ip"
                rules={[{ required: true, message: '请输入起始IP地址!' }]}>
                    <Input placeholder="请输入IP地址"/>
              </Form.Item>
              <LineOutlined style={{ fontSize: '20px', color: '#08c', margin: '10px' }} />
              <Form.Item
                name="end_ip"
                rules={[{ required: true, message: '请输入结束IP地址!' }]}>
                  <Input placeholder="请输入IP地址"/>
              </Form.Item>
            </Input.Group>
        </Form.Item>}
        {radioValue === 3 && <Form.Item required label="IP地址范围"
                name="subnet_ip"
                rules={[{ required: true, message: '请输入子网IP!' }]}>
                  <Input placeholder="请输入IP地址"/>
        </Form.Item>}
        {radioValue === 3 && <Form.Item required label="IP地址范围"
            name="subnet_mask" rules={[{ required: true, message: '请输入子网掩码!' }]}>
              <Input placeholder="请输入子网掩码"/>
        </Form.Item>}
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" onClick={doSubmit}>配置预览</Button>
        </Form.Item>
      </Form>
    );
}
export default observer(() => {
    const [form] = Form.useForm();
    const [preViewResult, setPreViewResult] = useState();
    const [modalState, setModalState] = useState(false);
    const handleSubmit = (flag) => {
        setModalState(true);
        const formData = form.getFieldsValue();
        formData.feature = "object";
        formData.preview = flag;
        console.log(JSON.stringify(formData));
        http.post('/api/template/network/', formData)
          .then(res => {
            setPreViewResult(res);
          }, () => setModalState(false));
        setModalState(false)
    };
    const formSubmit =()=>{
        handleSubmit(true);
    };
    const modalSubmit =()=>{
        handleSubmit(false);
    };
    return(
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑地址对象' : '新建地址对象'}
        confirmLoading={modalState}
        onCancel={() => store.formFlag = null}
        onOk={modalSubmit}>
        <TheForm form={form} doSubmit={formSubmit}/>
        <Txt preViewResult={preViewResult}/>
      </Modal>
    );
});