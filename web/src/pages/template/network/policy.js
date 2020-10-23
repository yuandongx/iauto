import React, {useState} from 'react';
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
/**
*默认的是Cisco
**/
const formItemLayout = {
  labelCol: { span: 4 },
  // wrapperCol: { span: 12 },
};
const Acl = ({platform, value={}, onChange, add, remove}) => {
  const [fields, Fields] = useState({});
  const triggerChange = (changeValue) => {
    if(onChange){
      onChange({
        ...fields,
        ...value,
        ... changeValue,
      });
    }
  }
  
  
  return (
    <Row align="middle">
      <Col span={12}>
        <Card>
              <Form.Item
                label="名称"
                {...formItemLayout}
                required>
                <Input/>
              </Form.Item>

              <Form.Item
                label="协议"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

              <Form.Item
                label="Action"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

              <Form.Item
                label="源服务端口"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

              <Form.Item
                label="目的务端口"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

              <Form.Item
                label="源地址对象"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

              <Form.Item
                label="目的址对象"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

              <Form.Item
                label="时间"
                {...formItemLayout}
                required>
                <Input />
              </Form.Item>

        </Card>
      </Col>
      <Col span={1}>
        <Space direction="vertical" align="center">
          <PlusCircleOutlined onClick={add}/>
          <MinusCircleOutlined onClick={remove}/>
        </Space>
      </Col>
    </Row>
  );
}



export default ({form, platform})=>{
  const [count, Count] = useState(0);
  const render = (fields, { add, remove }) => {
    return(
      <>
        {
          fields.map(field => (
            <div key={field.key}>
              <Form.Item
                {...field}
                name={[field.name, 'address_group']}
                fieldKey={[field.fieldKey, 'address_group']}
                rules={[{ required: true, message: 'Missing name' }]}
              >
              <Acl platform={platform} add={()=>{add(); Count(count +1);}} remove={()=>{remove(field.name); Count(count-1);}}/>
              </Form.Item>
            </div>
          ))
        }
        {count === 0 && <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {add(); Count(1);}}
                          block
                          >
                          <PlusOutlined />添加
                          </Button>
                        </Form.Item>}
      </>
    );
  }
  return(<Form
        form={form}
        name="dynamic_form_acl"
        autoComplete="off">
        <Form.List name={platform + "_policy"}>
          {render}
        </Form.List>
        </Form>);
}