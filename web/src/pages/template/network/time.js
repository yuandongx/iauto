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

const TimeEntry = ({value ={}, onChange, add, remove}) => {
  const [name, setName] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const trigartChange = (changeValue) => {
    if (onChange) {
      onChange({
        name,
        startTime,
        endTime,
        ...value,
        ...changeValue
      });
    }
  }
  const onStartTimeChange = (date, dateString) => {
    setStartTime(date.format("YYYY-MM-DD HH:mm:ss"));
    trigartChange({startTime: date.format("YYYY-MM-DD HH:mm:ss")});
  }
  const onEndTimeChange = (date, dateString) => {
    setEndTime(date.format("YYYY-MM-DD HH:mm:ss"));
    trigartChange({endTime: date.format("YYYY-MM-DD HH:mm:ss")});
  }
  const onHandleNameChange = (e) => {
    setName(e.target.value);
    trigartChange({name: e.target.value});
  }
  return (<Row align="middle" justify="space-around">
            <Col>
              <Form.Item label="名称" required name="name">
                <Input value={value.name||name} onChange={onHandleNameChange}/>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="开始时间" name="start_time">
                <Input value={value.startTime||startTime} hidden/>
                <DatePicker allowClear onChange={onStartTimeChange} showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="终止时间" required name="end_time">
                <Input value={value.endTime||endTime} hidden/>
                <DatePicker allowClear onChange={onEndTimeChange} showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
            <Col>
              <Space align="center" direction="vertical" size={1}>
                <PlusCircleOutlined onClick={add} />
                <MinusCircleOutlined onClick={remove} />
              </Space>
            </Col>
          </Row>);
} 

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
                    name={[field.name, 'time_range']}
                    fieldKey={[field.fieldKey, 'time_range']}
                    rules={[{ required: true, message: 'Missing name' }]}
                  >
                   <TimeEntry
                    add={()=>{add(); setCountEntry(countEntry +1);}}
                    remove={()=>{remove(); setCountEntry(countEntry - 1);}}/>
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