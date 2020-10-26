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
         Radio,
         Col } from 'antd';

const formItemLayout = {
  labelCol: { span: 4 },
  // wrapperCol: { span: 12 },
};

const actionTopsec = ["accept", "deny", "collect"]
export default ({form})=>{
  const [count, Count] = useState(0);
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