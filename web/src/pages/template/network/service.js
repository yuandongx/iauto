/***
*
***/
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined, LineOutlined, PlusOutlined, MinusCircleOutlined, PlusCircleTwoTone, MinusOutlined } from '@ant-design/icons';
import { Input,
         Button,
         Radio,
         Card,
         Form,
         Tabs,
         Select,
         Space,
         List,
         Row,
         Tag,
         Col } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import store from './store';
const { TabPane } = Tabs;
/**
*自定义表单项
**/
const ServiceEntry = ({ value = {}, onChange, add, remove }) => {
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
    <Row>
      <Col>
        <Card>
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
        </Card>
      </Col>
      <Col>
        <Space direction="vertical" align="center">
          <PlusCircleOutlined onClick={() => { add(); }}/>
          <MinusCircleOutlined onClick={() => { remove(); }}/>
        </Space>
      </Col>
    </Row>
  );
};
export const Service = observer(({ form }) => {
  const [countEntry, setCountEntry] = useState(0);
  const count = (i) => {
    setCountEntry(countEntry + i);
  }
  return (
      <Form 
        form={form}
        name="dynamic_form_service"
        autoComplete="off"
        layout="inline" >
        <Form.List name="service">
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
                    <ServiceEntry add={()=>{add(); count(1);}} remove={()=>{remove(field.name); count(-1)}}/>
                  </Form.Item>
                </Space>
              ))}
              {countEntry === 0 && <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => {add(); count(1);}}
                                        block
                                        >
                                        <PlusOutlined />添加
                                        </Button>
                                      </Form.Item>}
            </div>
          );
        }}
        </Form.List>
      </Form>
  );
});

/**
*自定义表单项
**/

const ServiceGroupEntry = ({ value = {}, onChange, add, remove }) => {
  const [name, setName] = useState();
  const [members, setMembers] = useState([]);
  const options = []
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        name,
        members,
        ...value,
        ...changedValue,
      });
    }
  };

  const onNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    triggerChange({name: v});
  }

  const onMemberChange = (v) => {
    console.log(`selected ${v}`);
    setMembers(v);
    triggerChange({members: v});
  }

  const forMap = items => items.map(item => ({label: item, value: item}));

  return(
  <div width="90%">
    <Row align="middle">
      <Col>
        <Card>
            <Space direction="vertical">
              <Input
                addonBefore="组名称"
                value={value.name || name}
                onChange={onNameChange}
                placeholder="组名称" />

              <Select
                placeholder="选择编辑组成员"
                options={forMap(value.members || members)}
                mode="tags"
                style={{ width: '100%' }} 
                onChange={onMemberChange}/>
            </Space>
        </Card>
      </Col>
      <Col>
        <Space direction="vertical" align="center">
          <PlusCircleOutlined onClick={() => { add(); }}/>
          <MinusCircleOutlined onClick={() => { remove(); }}/>
        </Space>
      </Col>
    </Row>
  </div>
  );
};


export const ServiceGroup = observer(({ form }) => {
  const [countEntry, setCountEntry] = useState(0);
  const count = (i) => {
    setCountEntry(countEntry + i);
  }
  return (
    <div>
      <Form
        form={form}
        name="dynamic_form_service_group"
        autoComplete="off"
        layout="inline">
      <Form.List name="service_group">
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
                    <ServiceGroupEntry add={()=>{add(); count(1);}} remove={()=>{remove(field.name); count(-1);}}/>
                  </Form.Item>
                </Space>
              ))}
              {countEntry === 0 && <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => {add(); count(1);}}
                                        block
                                        >
                                        <PlusOutlined />添加
                                        </Button>
                                      </Form.Item>}
            </div>
          );
        }}
      </Form.List>
    </Form>
    </div>
  );
});

