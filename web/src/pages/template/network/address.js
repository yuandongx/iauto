/***
*
***/
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined,
         PlusOutlined,
         MinusCircleOutlined,} from '@ant-design/icons';
import { Input,
         Button,
         Card,
         Form,
         Select,
         Space,
         Row,
         Col } from 'antd';
/****/
function isValidIP(ip) {
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
const validateHostIp = ip => {
  if (isValidIP(ip)) {
    return {validateStatus: "success", errorMsg: null};
  }
  return {validateStatus: "error", errorMsg: "IP地址格式错误."};
}

/**
*自定义表单项
**/
const AddressEntry = ({ value = {}, onChange, add, remove, platform }) => {
  const [type, setType] = useState("1");
  const [name, setName] = useState();
  const [hostIp, setHostIp] = useState();
  const [subnet, setSubnet] = useState();
  const [subnetMask, setSubnetMask] = useState();
  const [startIp, setStartIp] = useState();
  const [endIp, setEndIp] = useState();
  const [validateIP, setValidateIP] = useState({validateStatus: "", errorMsg: null});
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
    setValidateIP(validateHostIp(v));
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

  const onSelectHostIpChange = (v) => {
    setHostIp(v);
    // setValidateIP(validateHostIp(v));
    triggerChange({hostIp: v});
  }

  const addHostEntry = () => {
    if (platform === "topsec"){
      return (<Col span={12}><Form.Item label="主机IP" >
              <Select
                placeholder="主机IP地址"
                mode="tags"
                style={{ width: '100%' }} 
                onChange={onSelectHostIpChange}/>
              </Form.Item></Col>);
    } else {
      return (<Col span={8}><Form.Item label="主机IP" hasFeedback validateStatus={validateIP.validateStatus} help={validateIP.errorMsg}>
                <Input
				  placeholder="主机IP地址"
                  value={value.hostIp||hostIp}
                  onChange={onHostIpChange}/>
              </Form.Item></Col>);
    }
  }

  return(
    <Row align="middle">
      <Col>
        <Card style={{width: "800px"}}>
		<Row>
          <Col span={6}>
            <Form.Item label="名称">
              <Input
                value={value.name || name}
                onChange={onNameChange}
                placeholder="地址对象名称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="类型">
              <Select
                placeholder="默认主机地址"
                value={value.type || type}
                options={options}
                onChange={onTypeChange}/>
            </Form.Item>
          </Col>
            {type === "1" && addHostEntry() }
            { type === "2" &&
              <Col span={6}><Form.Item label="子网IP">
                <Input
				  placeholder="xx.xx.xx.xx"
                  value={value.subnet||subnet}
                  onChange={onSubnetChange}/>
              </Form.Item></Col>
            }
            { type === "2" &&<Col span={6}>
            <Form.Item label="子网掩码">
              <Input
			    placeholder="xx.xx.xx.xx"
                value={value.subnetMask||subnetMask}
                onChange={onSubnetMaskChange}/>
            </Form.Item></Col>
            }
            { type === "3" &&
              <><Col span={6}>
                <Form.Item label="地址范围">
                  <Input
                    placeholder="起始地址"
                    value={value.startIp||startIp}
                    onChange={onStartIpChange}/>
                </Form.Item></Col><Col span={6}>
                <Form.Item >
                  <Input
                    placeholder="结束地址"
                    value={value.endIp||endIp}
                    onChange={onEndIpChange}/>
                </Form.Item></Col>
              </>
            }

		</Row>
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
export const Address = observer(({ form, platform }) => {
  const [countEntry, setCountEntry] = useState(0);
  const count = (i) => {
    setCountEntry(countEntry + i);
  }
  return (

      <Form 
        form={form}
        name="dynamic_form_address"
        autoComplete="off"
        layout="inline" >
        <Form.List name={platform + "_address"}>
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
                    <AddressEntry platform={platform} add={()=>{add(); count(1);}} remove={()=>{remove(field.name); count(-1)}}/>
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

const AddressGroupEntry = ({ value = {}, getOptions, onChange, add, remove }) => {
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
                options={forMap(getOptions())}
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


export const AddressGroup = observer(({ form, platform }) => {
  const [countEntry, setCountEntry] = useState(0);
  const count = (i) => {
    setCountEntry(countEntry + i);
  }
  const getOptions = () => {
    const mayHaveFileds = form.getFieldsValue();
    let addresses = mayHaveFileds.address || []
    return addresses.map(item => {
      if (item !== undefined && item.address !== undefined){
        return item.address.name;
      }
      return null;
    });
  }
  return (
    <div>
      <Form
        form={form}
        name="dynamic_form_address_group"
        autoComplete="off"
        layout="inline">
      <Form.List name={platform + "_address_group"}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, 'address_group']}
                    fieldKey={[field.fieldKey, 'address_group']}
                    rules={[{ required: true, message: 'Missing name' }]}
                  >
                    <AddressGroupEntry getOptions={getOptions} add={()=>{add(); count(1);}} remove={()=>{remove(field.name); count(-1);}}/>
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
