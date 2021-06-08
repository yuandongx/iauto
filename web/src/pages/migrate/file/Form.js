
import React from 'react';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal,
         Input,
         Select,
         Tabs,
         DatePicker,
         InputNumber,
         Button,
         Steps } from 'antd';
import { ACEditor } from 'components';
import { http, cleanCommand } from 'libs';
import store from './store';
import styles from './index.module.css';
import moment from 'moment';
import lds from 'lodash';


@observer
class ComForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      type: null,
      content: store.record['content'],
      page: 0,
      nextRunTime: null,
    }
  }

  handleSubmit = () => {
    if (this.state.page === 0) {
        this.setState({ page: 1});
    } else if (this.state.page === 1) {
        this.setState({ page: 2});
    } else if (this.state.page === 2) {
        console.log("commiting...");
        this.setState({loading: true});
    }
  };

  handlePrevious = () => {

    if (this.state.page === 0) {
        store.formVisible = false;
    } else if (this.state.page === 1) {
        this.setState({ page: 0});
    } else if (this.state.page === 2) {
        this.setState({ page: 1});
    }
  }

  handleAddZone = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: '添加模板类型',
      content: this.addZoneForm,
      onOk: () => {
        if (this.state.type) {
          store.types.push(this.state.type);
          this.props.form.setFieldsValue({'label': this.state.type})
        }
      },
    })
  };

  addZoneForm = (
    <Form>
      <Form.Item required label="模板类型">
        <Input onChange={val => this.setState({type: val.target.value})}/>
      </Form.Item>
    </Form>
  );

  handleCancel = () => {
      store.formVisible = false;
  }

  render() {
    const info = store.record;
    const {getFieldDecorator} = this.props.form;
    const { page, nextRunTime } = this.state;
    return (
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑迁移策略' : '新建迁移策略'}
        confirmLoading={this.state.loading}
        onCancel={this.handleCancel}
        cancelText={ page === 0 ? '' : '' }
        footer={[
            <Button key="submit" type="primary" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="back" onClick={this.handlePrevious} hidden={ page === 0 }>
              上一步 
            </Button>,
            <Button
              key="link"
              type="primary"
              onClick={this.handleSubmit}
            >
              {page === 2 ? '确定' : '下一步' }
            </Button>,
          ]}
        onOk={this.handleSubmit}>
        <Steps current={page} className={styles.steps}>
          <Steps.Step key={0} title="源数据"/>
          <Steps.Step key={1} title="目的数据"/>
          <Steps.Step key={2} title="执行策略"/>
        </Steps>
        <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
    { page === 0 && <>
                      <Form.Item required label="选择源主机">
                          {getFieldDecorator('label', {initialValue: info['label']})(
                            <Select placeholder="请选择数据库主机">
                              {store.types.map(item => (
                                <Select.Option value={item} key={item}>{item}</Select.Option>
                              ))}
                            </Select>
                          )}
                      </Form.Item>
                      <Form.Item required label="数据库名称">
                        {getFieldDecorator('name', {initialValue: info['name']})(
                          <Input placeholder="请输入数据库名称"/>
                        )}
                      </Form.Item>
                      <Form.Item required label="数据表名称">
                        {getFieldDecorator('name', {initialValue: info['name']})(
                          <Input placeholder="请输入数据库名称"/>
                        )}
                      </Form.Item>
                      <Form.Item required label="选择时间段">
                          {getFieldDecorator('label', {initialValue: info['label']})(
                            <Select placeholder="请选数据迁移时间段">
                              {store.types.map(item => (
                                <Select.Option value={item} key={item}>{item}</Select.Option>
                              ))}
                            </Select>
                          )}
                      </Form.Item>
    </>}
  {page === 1 && <>
                      <Form.Item required label="选择源主机">
                          {getFieldDecorator('label', {initialValue: info['label']})(
                            <Select placeholder="请选择数据库主机">
                              {store.types.map(item => (
                                <Select.Option value={item} key={item}>{item}</Select.Option>
                              ))}
                            </Select>
                          )}
                      </Form.Item>
                      <Form.Item required label="数据库名称">
                        {getFieldDecorator('name', {initialValue: info['name']})(
                          <Input placeholder="请输入数据库名称"/>
                        )}
                      </Form.Item>
                      <Form.Item required label="数据表名称">
                        {getFieldDecorator('name', {initialValue: info['name']})(
                          <Input placeholder="请输入数据库名称"/>
                        )}
                      </Form.Item>
                    </>
  } 
  {page === 2 &&　<Form.Item wrapperCol={{span: 14, offset: 6}}>
              {getFieldDecorator('trigger', {valuePropName: 'activeKey', initialValue: info['trigger'] || 'interval'})(
                <Tabs tabPosition="left" style={{minHeight: 200}}>
                  <Tabs.TabPane tab="普通间隔" key="interval">
                    <Form.Item required label="间隔时间(秒)" extra="每隔指定n秒执行一次。">
                      <InputNumber
                        style={{width: 150}}
                        placeholder="请输入"
                        value={info['interval']}
                        onChange={v => this.handleArgs('interval', v)}/>
                    </Form.Item>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="一次性" key="date">
                    <Form.Item required label="执行时间" extra="仅在指定时间运行一次。">
                      <DatePicker
                        showTime
                        disabledDate={v => v && v.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')}
                        style={{width: 150}}
                        placeholder="请选择执行时间"
                        onOk={() => false}
                        value={info['date'] ? moment(info['date']) : undefined}
                        onChange={v => this.handleArgs('date', v)}/>
                    </Form.Item>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="UNIX Cron" key="cron">
                    <Form.Item required label="执行规则" help="兼容Cron风格，可参考官方例子">
                      <Input
                        suffix={nextRunTime || <span/>}
                        value={lds.get(info, 'cron.rule')}
                        placeholder="例如每天凌晨1点执行：0 1 * * *"
                        onChange={e => this.handleCronArgs('rule', e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="生效时间" help="定义的执行规则在到达该时间后生效">
                      <DatePicker
                        showTime
                        style={{width: '100%'}}
                        placeholder="可选输入"
                        value={lds.get(info, 'cron.start') ? moment(info['cron']['start']) : undefined}
                        onChange={v => this.handleCronArgs('start', v)}/>
                    </Form.Item>
                    <Form.Item label="结束时间" help="执行规则在到达该时间后不再执行">
                      <DatePicker
                        showTime
                        style={{width: '100%'}}
                        placeholder="可选输入"
                        value={lds.get(info, 'cron.stop') ? moment(info['cron']['stop']) : undefined}
                        onChange={v => this.handleCronArgs('stop', v)}/>
                    </Form.Item>
                  </Tabs.TabPane>
                  <Tabs.TabPane disabled tab="日历间隔" key="calendarinterval">
                  </Tabs.TabPane>
                </Tabs>
              )}
            </Form.Item>
  }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ComForm)
