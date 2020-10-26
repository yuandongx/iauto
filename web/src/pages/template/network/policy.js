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

const AddressItem = ({value={}, onChange, validateStatus}) => {
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
      <Select placeholder="端口类型" value={type} onChange={handleTypeChage}>
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

const formItemLayout = {
  labelCol: { span: 4 },
  // wrapperCol: { span: 12 },
};
const actionCisco = ["permit", "deny"]
const actionTopsec = ["accept", "deny", "collect"]
export default ({form, platform})=>{
  const [count, Count] = useState(0);
  const [srcPortStatus, setSrcPStatus] = useState({});
  const [dstPortStatus, setDstPStatus] = useState({});
  return(<Form
        form={form}
        name="dynamic_form_acl"
        autoComplete="off">
        <Form.List name={platform + "_policy"}>
          {(fields, { add, remove })=>(
            <>
            {console.log(fields)}
            {fields.map(field =>(
                <Row align="middle" key={field.key}>
                  <Col span={12}>
                    <Card>
                      <Form.Item
                        label="名称"
                        {...formItemLayout}
                        {...field}
                        key={"name" + field.key}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        required>
                        <Input/>
                      </Form.Item>

                      <Form.Item
                        label="Action"
                        {...formItemLayout}
                        {...field}
                        key={"action" + field.key}
                        name={[field.name, 'action']}
                        fieldKey={[field.fieldKey, 'action']}
                        required>
                        <Radio.Group
                         options={platform === "topsec" ? actionTopsec : actionCisco}/>
                      </Form.Item>

                      <Form.Item
                        label="协议"
                        {...formItemLayout}
                        {...field}
                        key={"protocol" + field.key}
                        name={[field.name, 'protocol']}
                        fieldKey={[field.fieldKey, 'protocol']}
                        required>
                         <Select
                            showSearch
                            style={{ width: 200 }}
                            options={protocols}
                            placeholder="Select a person"
                          />
                      </Form.Item>

                      <Form.Item
                        label="源服务端口"
                        {...formItemLayout}
                        {...field}
                        key={"src_port" + field.key}
                        name={[field.name, 'src_port']}
                        help={srcPortStatus.errorMsg}
                        validateStatus={srcPortStatus.vildate}
                        fieldKey={[field.fieldKey, 'src_port']}
                        >
                        <AddressItem validateStatus={setSrcPStatus}/>
                      </Form.Item>

                      <Form.Item
                        label="目的务端口"
                        {...formItemLayout}
                        {...field}
                        key={"dest_port" + field.key}
                        name={[field.name, 'dest_port']}
                        fieldKey={[field.fieldKey, 'dest_port']}
                        >
                        <AddressItem validateStatus={setDstPStatus}/>
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
                        >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="目的址对象"
                        {...formItemLayout}
                        {...field}
                        key={"dest_addres" + field.key}
                        name={[field.name, 'dest_addres']}
                        fieldKey={[field.fieldKey, 'dest_addres']}
                        >
                        <Input />
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