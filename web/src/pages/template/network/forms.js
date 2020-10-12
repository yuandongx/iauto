/***
*
***/
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { LineOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Button, Radio, Card, Form } from 'antd';
import store from './store';

export const Address = observer(({ handleData }) => {
  const [radioValue, setRadioValue] = useState(1);
  const [form] = Form.useForm();
  const radioChange = (e) => {
    setRadioValue(e.target.value);
  }
  const handleClick = () => {
    let data = form.getFieldsValue();
    data.feature = "address";
    handleData(data);
  }
  return (
    <Card>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
        <Form.Item required
          label="对象名称"
          name="name"
          rules={[{ required: true, message: '请输入对象名称!' }]}>
          <Input placeholder="请输入对象名称!" />
        </Form.Item>
        <Form.Item label="类型" name="kind" rules={[{ required: true, message: '请选择要配置的对象类型!' }]}>
          <Radio.Group onChange={(e) => radioChange(e)} value={radioValue}>
            <Radio value={1}>主机地址</Radio>
            <Radio value={2}>地址范围</Radio>
            <Radio value={3}>地址子网</Radio>
          </Radio.Group>
        </Form.Item>
        {radioValue === 1 && <Form.Item required label="IP地址" name="hostip" rules={[{ required: true, message: '请输入主机地址!' }]}>
          <Input placeholder="请输入IP地址" />
        </Form.Item>}
        {radioValue === 2 && <Form.Item required label="IP地址范围">
          <Input.Group compact>
            <Form.Item
              name="start_ip"
              rules={[{ required: true, message: '请输入起始IP地址!' }]}>
              <Input placeholder="请输入IP地址" />
            </Form.Item>
            <LineOutlined style={{ fontSize: '20px', color: '#08c', margin: '10px' }} />
            <Form.Item
              name="end_ip"
              rules={[{ required: true, message: '请输入结束IP地址!' }]}>
              <Input placeholder="请输入IP地址" />
            </Form.Item>
          </Input.Group>
        </Form.Item>}
        {radioValue === 3 && <Form.Item required label="IP地址范围"
          name="subnet_ip"
          rules={[{ required: true, message: '请输入子网IP!' }]}>
          <Input placeholder="请输入IP地址" />
        </Form.Item>}
        {radioValue === 3 && <Form.Item required label="IP地址范围"
          name="subnet_mask" rules={[{ required: true, message: '请输入子网掩码!' }]}>
          <Input placeholder="请输入子网掩码" />
        </Form.Item>}
        <Form.Item wrapperCol={{ span: 8, offset: 20 }}>
          <Button type="primary" shape="round" onClick={handleClick} icon={<PlusOutlined />} />
        </Form.Item>
      </Form>
    </Card>
  );
});