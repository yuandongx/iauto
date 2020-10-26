import React, {useState} from 'react';
import { protocols } from "./platform";
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
         Radio,
         Col } from 'antd';
/**
*默认的是Cisco
**/
const formItemLayout = {
  labelCol: { span: 4 },
  // wrapperCol: { span: 12 },
};
const actionCisco = ["permit", "deny"]
const actionTopsec = ["accept", "deny", "collect"]
export default ({form, platform})=>{
  const [count, Count] = useState(0);
  const render = (fields, { add, remove }) => {
    return(
      <>
        {
          fields.map(field => (
              <Row align="middle" key={field.key}>
                <Col span={12}>
                  <Card>
                    <Form.Item
                      label="名称"
                      {...formItemLayout}
                      {...field}
                      name={[field.name, 'name']}
                      fieldKey={[field.fieldKey, 'name']}
                      required>
                      <Input/>
                    </Form.Item>

                    <Form.Item
                      label="Action"
                      {...formItemLayout}
                      {...field}
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
                      name={[field.name, 'protocol']}
                      fieldKey={[field.fieldKey, 'protocol']}
                      required>
                       <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        />
                    </Form.Item>

                    <Form.Item
                      label="源服务端口"
                      {...formItemLayout}
                      {...field}
                      name={[field.name, 'src_port']}
                      fieldKey={[field.fieldKey, 'src_port']}
                      required>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="目的务端口"
                      {...formItemLayout}
                      {...field}
                      name={[field.name, 'dest_port']}
                      fieldKey={[field.fieldKey, 'dest_port']}
                      required>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="源地址对象"
                      {...formItemLayout}
                      {...field}
                      name={[field.name, 'src_address']}
                      fieldKey={[field.fieldKey, 'src_address']}
                      required>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="目的址对象"
                      {...formItemLayout}
                      {...field}
                      name={[field.name, 'dest_addres']}
                      fieldKey={[field.fieldKey, 'dest_addres']}
                      required>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="时间"
                      {...formItemLayout}
                      {...field}
                      name={[field.name, 'time_range']}
                      fieldKey={[field.fieldKey, 'time_range']}
                      required>
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