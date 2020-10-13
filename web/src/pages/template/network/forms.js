/***
*
***/
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { LineOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Input, Button, Radio, Card, Form, Tabs, Select, Space} from 'antd';
import store from './store';
const { TabPane } = Tabs;
/**
*自定义表单项
**/
const AddressEntry = ({ value = {}, onChange }) => {
  const [type, setType] = useState("1");
  const [name, setName] = useState();
  const [hostIp, setHostIp] = useState();
  const [subnet, setSubnet] = useState();
  const [subnetMask, setSubnetMask] = useState();
  const [startIp, setStartIp] = useState();
  const [endIp, setEndIp] = useState();
  const options = [
  {label: "主机地址", value: "1"},
  {label: "子网地址", value: "2"},
  {label: "地址范围", value: "3"},
  ]
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        name,
        type,
        hostIp,
        subnet,
        subnetMask,
        startIp,
        endIp,
        ...value,
        ...changedValue,
      });
    }
  };
  const onTypeChange = (v) => {
    setType(v);
    triggerChange({type: v});
  }
  const onNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    triggerChange({name: v});
  }
  const onHostIpChange = (e) => {
    const v = e.target.value;
    setHostIp(v);
    triggerChange({hostIp: v});
  }
  const onSubnetChange = (e) => {
    const v = e.target.value;
    setSubnet(v);
    triggerChange({subnet: v});
  }
  const onSubnetMaskChange = (e) => {
    const v = e.target.value;
    setSubnetMask(v);
    triggerChange({subnetMask: v});
  }
  const onStartIpChange = (e) => {
    const v = e.target.value;
    setStartIp(v);
    triggerChange({startIp: v});
  }
  const onEndIpChange = (e) => {
    const v = e.target.value;
    setEndIp(v);
    triggerChange({endIp: v});
  }
  const onHiddenTypeChange = (e) => {
    const v = e.target.value;
    triggerChange({type: v});
  }
  return(
    <Input.Group compact>
      <Form.Item name="objectName" label="名称">
        <Input
          value={value.name || name}
          onChange={onNameChange}
          placeholder="地址对象名称" />
      </Form.Item>
      <Form.Item name="objectType" label="类型">
        <Select
          placeholder="默认主机地址"
          value={value.type || type}
          options={options}
          onChange={onTypeChange}/>
      </Form.Item>
      { type === "1" &&
      <Form.Item name="objectHostIp" label="主机IP">
        <Input
          value={value.hostIp||hostIp}
          onChange={onHostIpChange}/>
      </Form.Item>
      }
      { type === "2" &&
        <Form.Item name="objectSubnet" label="子网IP">
          <Input
            value={value.subnet||subnet}
            onChange={onSubnetChange}/>
        </Form.Item>
      }
      { type === "2" &&
      <Form.Item name="objectMask" label="子网掩码">
        <Input
          value={value.subnetMask||subnetMask}
          onChange={onSubnetMaskChange}/>
      </Form.Item>
      }
      { type === "3" &&
        <>
          <Form.Item name="objectStartIp" label="子网IP">
            <Input
              placeholder="起始地址"
              value={value.startIp||startIp}
              onChange={onStartIpChange}/>
          </Form.Item>
          <Form.Item name="objectEndIp">
            <Input
              placeholder="结束地址"
              value={value.endIp||endIp}
              onChange={onEndIpChange}/>
          </Form.Item>
        </>
      }
    </Input.Group>
  );
};

export const Address = observer(({ form }) => {
  return (
    <Card>
      <Form form={form} name="dynamic_form_nest_item" autoComplete="off" layout="inline" >
        <Form.List name="addresses">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, 'address']}
                    fieldKey={[field.fieldKey, 'address']}
                    rules={[{ required: true, message: 'Missing first name' }]}
                  >
                    <AddressEntry />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined />添加
                </Button>
              </Form.Item>
            </div>
          );
        }}
        </Form.List>
      </Form>
    </Card>

  );
});


export const AddressGroup = observer(({ form }) => {

  return (
    <Card>
      <Form form={form} name="dynamic_form_nest_item" autoComplete="off" >
      <Form.List name="users">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, 'startTime']}
                    fieldKey={[field.fieldKey, 'startTime']}
                    rules={[{ required: true, message: 'Missing first name' }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'endTime']}
                    fieldKey={[field.fieldKey, 'endTime']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Form>
    </Card>
  );
});


export const Service = observer(({ handleData }) => {
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


export const ServiceGroup = observer(({ handleData }) => {
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

