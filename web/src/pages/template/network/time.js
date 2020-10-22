import { Form,
        Button,
        Input,
        DatePicker,
        Row,
        Col,
        Space} from 'antd';
import { PlusOutlined,
         PlusCircleOutlined,
         MinusCircleOutlined} from '@ant-design/icons'
import React, { useState } from 'react';

export default ({ form, platform  }) => {
  
  const [countEntry, setCountEntry] = useState(0);

  // const getOptions = () => {
    // const mayHaveFileds = form.getFieldsValue();
    // let services = mayHaveFileds.service || []
    // return services.map(item => {
      // if (item!==undefined && item.service !== undefined){
        // return item.service.name;
      // }
      // return null
    // });
  // };
  // const options = getOptions();

  return (
    <div>
      <Form
        form={form}
        name="dynamic_form_time_range"
        autoComplete="off"
        layout="inline">
      <Form.List name={platform + "_time_range"}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                  <Form.Item
                    {...field}
                    name={[field.name, 'service_group']}
                    fieldKey={[field.fieldKey, 'service_group']}
                    rules={[{ required: true, message: 'Missing name' }]}
                  >
                    <Row align="middle" justify="space-around">
                      <Col>
                        <Form.Item label="名称" required>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item label="时间" required>
                          <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Space align="center" direction="vertical" size={1}>
                          <PlusCircleOutlined onClick={() => {add(); setCountEntry(countEntry + 1)}} />
                          <MinusCircleOutlined onClick={() => {remove(field.name); setCountEntry(countEntry - 1);}} />
                        </Space>
                      </Col>
                    </Row>
                  </Form.Item>
              ))}
              {countEntry === 0 && <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => {add(); setCountEntry(1);}}
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