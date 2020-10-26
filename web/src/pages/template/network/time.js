import { Form,
        Button,
        Input,
        DatePicker,
        Row,
        Col,
        Card,
        Space} from 'antd';
import { PlusOutlined,
         PlusCircleOutlined,
         MinusCircleOutlined} from '@ant-design/icons'
import React, { useState } from 'react';
import * as moment from 'moment';
/**自定义时间控件**/
const TimeEntry = ({value ={}, platform, onChange, add, remove}) => {
  const [name, setName] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startStatus, setStartStatus] = useState({});
  const [endStatus, setEndStatus] = useState({});
  const format = "YYYY-MM-DD HH:mm:ss";
  const triggerChange = (changeValue) => {
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
    setStartTime(date.format(format));
    triggerChange({startTime: date.format(format)});
    setStartStatus({moment: date});
    if(endStatus.moment !== undefined && moment.max(date, endStatus.moment) === date) {
      setStartStatus({validateStatus: "error", help: "开始时间必须小于终止时间."});
    } else {
      setStartStatus({validateStatus: "Success"});
    }
  }
  const onEndTimeChange = (date, dateString) => {
    setEndTime(date.format(format));
    triggerChange({endTime: date.format(format)});
    setEndStatus({moment: date});
    if(startStatus.moment !== undefined && moment.min(date, startStatus.moment) === date) {
      setEndStatus({validateStatus: "error", help: "终止时间必须大于开始时间."});
    } else {
      setEndStatus({validateStatus: "Success"});
    }
  }
  const onHandleNameChange = (e) => {
    setName(e.target.value);
    triggerChange({name: e.target.value});
  }
  return (<Row align="middle" justify="left">
            <Col span={16}>
              <Card>
                <Row align="middle" justify="center">
                  <Col>
                    <Form.Item label="名称" required name="name">
                      <Input value={value.name||name} onChange={onHandleNameChange}/>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="开始时间"
                      required={platform === "topsec"}
                      help={startStatus.help}
                      hasFeedback
                      validateStatus={startStatus.validateStatus}
                      name="start_time">
                      <DatePicker
                        allowClear
                        onChange={onStartTimeChange}
                        showTime
                        value={moment(value.startTime||startTime, format)}
                        format={format}/>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="终止时间"
                      required
                      help={endStatus.help}
                      hasFeedback
                      validateStatus={endStatus.validateStatus}
                      name="end_time">
                      <DatePicker
                        allowClear
                        value={moment(value.endTime||endTime, format)}
                        onChange={onEndTimeChange}
                        showTime
                        format={format} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col>
              <Space align="center" direction="vertical">
                <PlusCircleOutlined onClick={add} />
                <MinusCircleOutlined onClick={remove} />
              </Space>
            </Col>
          </Row>);
} 
/**时间组件**/
export default ({ form, platform  }) => {
  const [countEntry, setCountEntry] = useState(0);
  return (
    <div>
      <Form
        form={form}
        name="dynamic_form_time_range"
        autoComplete="off">
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
                    platform={platform}
                    add={()=>{add(); setCountEntry(countEntry +1);}}
                    remove={()=>{remove(field.name); setCountEntry(countEntry - 1);}}/>
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