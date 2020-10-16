/***
*
***/
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined,
         PlusOutlined,
         MinusCircleOutlined,
        } from '@ant-design/icons';
import { Input,
         Button,
         Checkbox,
         Card,
         Form,
         Select,
         Space,
         Row,
         InputNumber,
         Col
        } from 'antd';
/**
*自定义表单项
**/
const ServiceEntry = ({ value = {}, onChange, add, remove }) => {
  const [protocol, setProtocol] = useState();
  const [name, setName] = useState();
  const [dstPortType, setDstPortType] = useState("eq");
  const [srcPortType, setSrcPortType] = useState("eq");
  const [srcPort1, setSrcPort1] = useState();
  const [srcPort2, setSrcPort2] = useState();
  const [dstPort1, setDstPort1] = useState();
  const [dstPort2, setDstPort2] = useState();

  const options = [
        {label: "tcp", value: "tcp"},
        {label: "udp", value: "udp"},
    ]
  const portOptions = [
        {label: "lt", value: "lt"},
        {label: "gt", value: "gt"},
        {label: "eq", value: "eq"},
        {label: "range", value: "range"},
    ]
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        name,
        protocol,
        srcPortType,
        dstPortType,
        srcPort1,
        srcPort2,
        dstPort1,
        dstPort2,
        ...value,
        ...changedValue,
      });
    }
  };
  const onProtocolChange = (checkedList) => {
    setProtocol([...checkedList]);
    triggerChange({protocol: checkedList});
    console.log(protocol);
  }
  const onNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    triggerChange({name: v});
  }
  const onSrcPort1Change = (v) => {
    setSrcPort1(v);
    triggerChange({srcPort1: v});
  }
  const onSrcPort2Change = (v) => {
    setSrcPort2(v);
    triggerChange({srcPort2: v});
  }
  const onDstPort1Change = (v) => {
    setDstPort1(v);
    triggerChange({dstPort1: v});
  }
  const onDstPort2Change = (v) => {
    setDstPort2(v);
    triggerChange({dstPort2: v});
  }

  const onSrcPortSelectChange = (v) => {
    setSrcPortType(v);
    console.log(v);
    triggerChange({srcPortType: v});
  }
  const onDstPortSelectChange= (v) => {
    setDstPortType(v);
    console.log(v);
    triggerChange({dstPortType: v});
  }
  return(
    <Row align="middle">
      <Col>
        <Card>
        <Space direction="vertical">
          <Row>
            <Form.Item label="名称">
              <Input
                value={value.name || name}
                onChange={onNameChange}
                placeholder="地址对象名称" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label="协议">
              <Input hidden value={protocol}/>
              <Checkbox.Group options={options} onChange={onProtocolChange} />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label="源端口">
              <Input.Group compact>
                <Select defaultValue="eq" options={portOptions} onChange={onSrcPortSelectChange} />
                <InputNumber
                  min={1}
                  max={65535}
                  value={value.srcPort1||srcPort1}
                  onChange={onSrcPort1Change}
                  style={{ width: 100, textAlign: 'center' }}
                  placeholder={srcPortType ==="range" ? "MiniPort" : "PortNumber"} />
                    {srcPortType==="range" && <><Input
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
                    <InputNumber
                      min={1}
                      max={65535}
                      value={value.srcPort2||srcPort2}
                      onChange={onSrcPort2Change}
                      className="site-input-right"
                      style={{
                        width: 100,
                        textAlign: 'center',
                      }}
                      placeholder="Maximum"
                    /></>}
              </Input.Group>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label="目的端口">
              <Input.Group compact>
                <Select defaultValue="eq" options={portOptions} onChange={onDstPortSelectChange} />
                <InputNumber
                  min={1}
                  max={65535}
                  value={value.dstPort1||dstPort1}
                  onChange={onDstPort1Change}
                  style={{ width: 100, textAlign: 'center' }}
                  placeholder={dstPortType ==="range" ? "MiniPort" : "PortNumber"} />
                    {dstPortType==="range" && <><Input
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
                    <InputNumber
                      min={1}
                      max={65535}
                      value={value.dstPort2||dstPort2}
                      onChange={onDstPort2Change}
                      className="site-input-right"
                      style={{
                        width: 100,
                        textAlign: 'center',
                      }}
                      placeholder="Maximum"
                    /></>}
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
                    name={[field.name, 'service']}
                    fieldKey={[field.fieldKey, 'service']}
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
                    name={[field.name, 'service_group']}
                    fieldKey={[field.fieldKey, 'service_group']}
                    rules={[{ required: true, message: 'Missing name' }]}
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

