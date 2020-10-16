/***
*
***/
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined, LineOutlined, PlusOutlined, MinusCircleOutlined, PlusCircleTwoTone, MinusOutlined } from '@ant-design/icons';
import { Input,
         Button,
         Checkbox,
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
  const [protocol, setProtocol] = useState([]);
  const [name, setName] = useState();
  const [hostIp, setHostIp] = useState();
  const [subnet, setSubnet] = useState();
  const [subnetMask, setSubnetMask] = useState();
  const [startIp, setStartIp] = useState();
  const [endIp, setEndIp] = useState();
  const options = [
        {label: "tcp", value: "tcp"},
        {label: "udp", value: "udp"},
    ]
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        name,
        protocol,
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
  const onProtocolChange = (checkedList) => {
    setProtocol(checkedList);
    // triggerChange({protocol: protocol});
    console.log(protocol);
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
    <Row align="middle">
      <Col>
        <Card>
        <Space direction="vertical">
          <Row>
            <Form.Item name="objectName" label="名称">
              <Input
                value={value.name || name}
                onChange={onNameChange}
                placeholder="地址对象名称" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item name="objectProtocol" label="协议">
              <Checkbox.Group options={options} onChange={onProtocolChange} value={protocol} />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item name="objectSource" label="源端口">
              <Input.Group compact>
                <Select defaultValue="3">
                  <Select.Option value="1">小于</Select.Option>
                  <Select.Option value="2">大于</Select.Option>
                  <Select.Option value="3">等于</Select.Option>
                  <Select.Option value="4">范围</Select.Option>
                </Select>
                <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  className="site-input-right"
                  style={{
                    width: 100,
                    textAlign: 'center',
                  }}
                  placeholder="Maximum"
                />
              </Input.Group>
            </Form.Item>
          </Row>
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

