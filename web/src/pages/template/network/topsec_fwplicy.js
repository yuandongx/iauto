import React, {useState} from 'react';
import { protocols } from "./platforms";
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
         InputNumber,
         Radio,
         Col } from 'antd';
/**
*默认的是Cisco
**/
/**
*自定义端口组件
**/
const PortItem = ({value={}, onChange, validateStatus}) => {
  const [type, setType] = useState("eq");
  const [port1, setPort1] = useState();
  const [port2, setPort2] = useState();
  const triggerChange = changeValue => {
    if(onChange){
      onChange({
        type,
        port1,
        port2,
        ...value,
        ...changeValue
      });
    }
  }
  const handlePort1Chage = (v) => {
    setPort1(v);
    triggerChange({port1: v});
    if (port2 !== undefined && type === "range" && v > port2) {
      validateStatus({errorMsg: "终止端口必须大于起始端口", vildate: "error"});
    } else {
      validateStatus({errorMsg: "", vildate: "success"});
    }
  }
  const handlePort2Chage = (v) => {
    setPort2(v);
    triggerChange({port2: v});
    if (port1 !== undefined && v < port1) {
      validateStatus({errorMsg: "终止端口必须大于起始端口", vildate: "error"});
    } else {
      validateStatus({errorMsg: "", vildate: "success"});
    }
  }
  const handleTypeChage = (v) => {
    setType(v);
    triggerChange({type: v});
    setPort1();
    setPort2();
    if(v !== "range"){validateStatus({});}
  }
  const placeholdersPort1 = () => {
    if(type === "range") {
      return "起始端口"
    } else if(type === "eq") {
      return "等于某个端口"
    } else if(type === "neq"){
      return "不等于某个端口"
    } else if(type === "lt"){
      return "小于某个端口"
    } else if(type === "gt"){
      return "小于某个端口"
    }
    return ""
  }
  return (
    <Space>
      <Select placeholder="端口类型" style={{ width: 100 }} value={type} onChange={handleTypeChage}>
        <Select.Option value="eq">eq</Select.Option>
        <Select.Option value="neq">neq</Select.Option>
        <Select.Option value="range">range</Select.Option>
        <Select.Option value="lt">lt</Select.Option>
        <Select.Option value="gt">gt</Select.Option>
      </Select>
      <InputNumber
        value={port1}
        onChange={handlePort1Chage}
        max={65535}
        min={1}
        placeholder={placeholdersPort1()}/>
      {type === "range" && <InputNumber
                            value={port2}
                            placeholder="终止端口"
                            max={65535}
                            min={1}
                            onChange={handlePort2Chage} />}
    </Space>
    );
}
/**
*自定义地址组件
**/
const AddressItem = ({value={}, onChange, validateStatus}) => {
  const [type, setType] = useState();
  const [ip, setIp] = useState();
  const [mask, setMask] = useState();
  const triggerChange = changeValue => {
    if(onChange){
      onChange({
        type,
        ip,
        mask,
        ...value,
        ...changeValue
      });
    }
  }
  const handleIPChage = (e) => {
    setIp(e.target.value);
    triggerChange({ip: e.target.value});
    // if (port2 !== undefined && type === "range" && v > port2) {
      // validateStatus({errorMsg: "终止端口必须大于起始端口", vildate: "error"});
    // } else {
      // validateStatus({errorMsg: "", vildate: "success"});
    // }
  }
  const handleMaskChage = (e) => {
    setMask(e.target.value);
    triggerChange({mask: e.target.value});
    // if (port1 !== undefined && v < port1) {
      // validateStatus({errorMsg: "终止端口必须大于起始端口", vildate: "error"});
    // } else {
      // validateStatus({errorMsg: "", vildate: "success"});
    // }
  }
  const handleTypeChage = (v) => {
    setType(v);
    triggerChange({type: v});
    // setPort1();
    // setPort2();
    // if(v !== "range"){validateStatus({});}
  }
  const placeholdersIP = () => {
    if(type === "any") {
      return "any"
    } else if(type === "host") {
      return "主机IP,如: 1.1.1.1"
    } else if(type === "subnet"){
      return "子网IP,如: 1.1.1.0"
    } else if(type === "object"){
      return "地址对象(组)"
    } 
    return ""
  }
  return (
    <Space>
      <Select placeholder="选择对象类型" value={type} onChange={handleTypeChage}>
        <Select.Option value="any">任意地址</Select.Option>
        <Select.Option value="host">主机地址</Select.Option>
        <Select.Option value="subnet">子网地址</Select.Option>
        <Select.Option value="object">地址对象</Select.Option>
      </Select>
      {type !==undefined &&<Input
                            value={ip}
                            onChange={handleIPChage}
                            disabled={type === "any"?true:false}
                            placeholder={placeholdersIP()}/>}
      {type === "subnet" && <Input
                            value={mask}
                            placeholder="子网掩码"
                            onChange={handleMaskChage} />}
    </Space>
    );
}

const formItemLayout = {
  labelCol: { span: 4 },
  // wrapperCol: { span: 12 },
};

const actionTopsec = ["accept", "deny", "collect"]
export default ({form})=>{
  const [count, Count] = useState(0);
  const [srcPortStatus, setSrcPStatus] = useState({});
  const [dstPortStatus, setDstPStatus] = useState({});
  return(<Form
        form={form}
        name="dynamic_form_topsec_fw_policy"
        autoComplete="off">
        <Form.List name="topsec_policy">
          {(fields, { add, remove })=>(
            <>
            {console.log(fields)}
            {fields.map(field =>(
                <Row align="middle" key={field.key}>
                  <Col span={12}>
                    <Card>

                      <Form.Item
                        label="Action"
                        {...formItemLayout}
                        {...field}
                        key={"action" + field.key}
                        name={[field.name, 'action']}
                        fieldKey={[field.fieldKey, 'action']}
                        required>
                        <Radio.Group
                         options={actionTopsec}/>
                      </Form.Item>

                      <Form.Item
                        label="源域"
                        {...formItemLayout}
                        {...field}
                        key={"src_area" + field.key}
                        name={[field.name, 'src_area']}
                        help={srcPortStatus.errorMsg}
                        validateStatus={srcPortStatus.vildate}
                        fieldKey={[field.fieldKey, 'src_area']}
                        >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="目的域"
                        {...formItemLayout}
                        {...field}
                        key={"dst_area" + field.key}
                        name={[field.name, 'dst_area']}
                        help={srcPortStatus.errorMsg}
                        validateStatus={srcPortStatus.vildate}
                        fieldKey={[field.fieldKey, 'dst_area']}
                        >
                        <Input/>
                      </Form.Item>

                      <Form.Item
                        label="源地址对象"
                        {...formItemLayout}
                        {...field}
                        key={"src_address" + field.key}
                        name={[field.name, 'src_address']}
                        fieldKey={[field.fieldKey, 'src_address']}
                        help={dstPortStatus.errorMsg}
                        validateStatus={dstPortStatus.vildate}
                        required>
                        <Select
                          mode="tags"
                          style={{ width: 200 }}
                          />
                      </Form.Item>

                      <Form.Item
                        label="目的址对象"
                        {...formItemLayout}
                        {...field}
                        key={"dest_addres" + field.key}
                        name={[field.name, 'dest_address']}
                        fieldKey={[field.fieldKey, 'dest_addres']}
                        required>
                        <Select
                          mode="tags"
                          style={{ width: 200 }}
                          />
                      </Form.Item>

                      <Form.Item
                        label="服务"
                        {...formItemLayout}
                        {...field}
                        key={"service" + field.key}
                        name={[field.name, 'service']}
                        fieldKey={[field.fieldKey, 'service']}
                        required>
                         <Select
                          mode="tags"
                          style={{ width: 200 }}
                          />
                      </Form.Item>

                      <Form.Item
                        label="时间对象"
                        {...formItemLayout}
                        {...field}
                        key={"time_range" + field.key}
                        name={[field.name, 'time_range']}
                        fieldKey={[field.fieldKey, 'time_range']}
                        >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="描述信息"
                        {...formItemLayout}
                        {...field}
                        key={"comment" + field.key}
                        name={[field.name, 'comment']}
                        fieldKey={[field.fieldKey, 'comment']}
                        >
                        <Input.TextArea />
                      </Form.Item>

                    </Card>
                  </Col>
                  <Col span={1}>
                    <Space direction="vertical" align="center">
                      <PlusCircleOutlined onClick={()=>{add(); Count(count+1)}}/>
                      <MinusCircleOutlined onClick={()=>{remove(field.name); Count(count-1)}}/>
                    </Space>
                  </Col>
                </Row>
              ))
            }
            {count === 0 && <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {add(); Count(1);}}
                          >
                          <PlusOutlined />添加
                          </Button>
              </Form.Item>}
            </>)}

        </Form.List>
        </Form>);
}