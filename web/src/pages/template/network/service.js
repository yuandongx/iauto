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
         Radio,
         InputNumber,
         Col
        } from 'antd';
import style from "./style.css"
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
    triggerChange({srcPortType: v});
  }
  const onDstPortSelectChange= (v) => {
    setDstPortType(v);
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
export const Service = ({ form, platform }) => {
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
        <Form.List name={platform + "service"}>
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
};

/**
*自定义表单项
**/
const Entry = ({name, noRemove, addEntry, removeEntry, value, onChange}) => {
  const [type, setType] = useState("group-object");
  const [ptype, setPType] = useState("eq");
  const [gname, setGname] = useState();
  const [port1, setPort1] = useState();
  const [port2, setPort2] = useState();

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({
        key: name,
        type,
        ptype,
        gname,
        port1,
        port2,
        ...value,
        ...changedValue
      });
    }
  }
  const handleObjectChange = v => {
    setType(v);
    triggerChange({type: v});
  }
  const handlePortTypeChange = v => {
    setPType(v);
    triggerChange({ptype: v});
  }

  const handleNameChange = e => {
    setGname(e.target.value)
    triggerChange({gname: e.target.value});
  }

  const handlePort1Change = e => {
    setPort1(e.target.value);
    triggerChange({port1: e.target.value});
  }

  const handlePort2Change = e => {
    setPort2(e.target.value);
    triggerChange({port2: e.target.value});
  }

  const portObjectInput = () => {
    if(type === "group-object") {
      return (<Col span={12}>
                  <Input value={value.gname || gname} onChange={handleNameChange}/>
              </Col>);
    } else if (type === "port-object" && ptype === "eq") {
      return (
        <>
          <Col span={4}>
              <Select value={value.ptype || ptype} onChange={handlePortTypeChange}>
                <Select.Option value="eq">eq</Select.Option>
                <Select.Option value="range">range</Select.Option>
              </Select>
          </Col>
          <Col span={8}>
              <Input value={value.port1|| port1} onChange={handlePort1Change}/>
          </Col>
          
        </>
      );
    } else if (type === "port-object" && ptype === "range") {
      return(
        <>
          <Col span={4}>
              <Select value={value.ptype || ptype} onChange={handlePortTypeChange}>
                <Select.Option value="eq">eq</Select.Option>
                <Select.Option value="range">range</Select.Option>
              </Select>
          </Col>
          <Col span={5}>
             <Input value={value.port1|| port1} onChange={handlePort1Change}/>
          </Col>
          <Col span={1}>
            <Input disabled value="－"/>
          </Col>
          <Col span={5}>
             <Input value={value.port2|| port2} onChange={handlePort2Change}/>
          </Col>
        </>
      );
    }
    return (<></>);
  }

  return (
    <Row align="middle">
      <Col span={6}>
          <Select value={value.type} onChange={handleObjectChange}>
            <Select.Option value="port-object">port-object</Select.Option>
            <Select.Option value="group-object">group-object</Select.Option>
          </Select>
      </Col>
      {portObjectInput()}
      <Col span={2}>
        <Space direction="vertical" align="center" size={0}>
          <PlusCircleOutlined onClick={()=> {addEntry();}}/>
          {!noRemove && <MinusCircleOutlined onClick={()=> {removeEntry(name);}}/>}
        </Space>
      </Col>
    </Row>
  );
};
const ServiceGroupEntry = ({ value = {}, selections, onChange, add, remove }) => {
  const [name, setName] = useState();
  const [protocol, setProtocol] = useState(0);
  const [entries, setEntries] = useState([]);
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        name,
        protocol,
        entries,
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

  const onProtocolChange = (e) => {
    setProtocol(e.target.value);
    triggerChange({protocol: e.target.value});
  }

  const addEntry = item => {
    var id;
    if(entries.length === 0) {
      id = 0;
    } else {
      let i = entries.length - 1;
      id = Number(entries[i].key) + 1;
    }
    const new_item = {...item, key: String(id)};
    setEntries([...entries, new_item]);

  }

  const removeEntry = key => {

    let new_entries = entries.filter(item => item.key !== key);
    setEntries(new_entries);
  }

  const handEntryChange = v => {
    if (v.key === undefined) {
      return;
    }
    var flag = false;
    for (var index=0; index < entries.length; index++){
      if(entries[index].key === v.key){
        entries[index] = v;
        setEntries(entries);
        flag = true;
        break;
      }
    }
    if (!flag) {
      setEntries([...entries, v]);
    }
    triggerChange({entries: entries});
  }
  const mapEntries = () => {
    var noRemove = false;
    if(entries.length < 2) {
      noRemove = true;
    }
    if(entries.length === 0) {
      return (<Entry
                addEntry={addEntry}
                removeEntry={removeEntry}
                key={"0"}
                name={"0"}
                value={{type: "group-object", key: "0"}}
                onChange={handEntryChange}
                noRemove={noRemove} />);
    }
    
    return (
    <>
    {entries.map(item => (<Entry
                            addEntry={addEntry}
                            removeEntry={removeEntry}
                            key={item.key}
                            name={item.key}
                            value={item}
                            onChange={handEntryChange}
                            noRemove={noRemove} />))}
   </>)
  }


  const forMap = items => items.map(item => ({label: item, value: item}));

  return(
        <Card style={{width: "800px"}} bordered={false}>
          <Row align="middle" justify="center">
            <Col span={23}>
              <Card>
                <Row>
                  <Col span={23}>
                    <Input
                      addonBefore="组名称"
                      style={{width: "90%"}}
                      onChange={onNameChange}
                      value={value.name || name}/>
                  </Col>
                </Row>
                <Row gutter={[2, 2]}>
                  <Col span={3}>
                    <span>
                      选择组协议:
                    </span>
                  </Col>
                  <Col span={12}>
                    <Radio.Group onChange={onProtocolChange} value={protocol}>
                      <Radio value={0}>不指定(默认)</Radio>
                      <Radio value={1}>tcp</Radio>
                      <Radio value={2}>udp</Radio>
                      <Radio value={3}>tcp-udp</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                  {mapEntries()}
              </Card>
            </Col>
            <Col span={1}>
              <Space direction="vertical" align="center">
                <PlusCircleOutlined onClick={() => { add(); }}/>
                <MinusCircleOutlined onClick={() => { remove(); }}/>
              </Space>
            </Col>
          </Row>
      </Card>
  );
};


export const ServiceGroup = ({ form, platform  }) => {
  
  const [countEntry, setCountEntry] = useState(0);
  const count = (i) => {
    setCountEntry(countEntry + i);
  };
  const getOptions = () => {
    const mayHaveFileds = form.getFieldsValue();
    let services = mayHaveFileds.service || []
    return services.map(item => {
      if (item!==undefined && item.service !== undefined){
        return item.service.name;
      }
    });
  };
  const options = getOptions();

  return (
    <div>
      <Form
        form={form}
        name="dynamic_form_service_group"
        autoComplete="off"
        layout="inline">
      <Form.List name={platform + "_service_group"}>
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
                    <ServiceGroupEntry selections={options}  add={()=>{add(); count(1);}} remove={()=>{remove(field.name); count(-1);}}/>
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
};

