
import React, {useState} from 'react';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Modal,
         Input,
         Select,
         Tabs,
         DatePicker,
         InputNumber,
         Button,
         message,
         Divider,
         Space,
         Form,
         Steps } from 'antd';

import { http, cleanCommand } from 'libs';
import store from './store';
import styles from './index.module.css';
import moment from 'moment';
import lds from 'lodash';
const { RangePicker } = DatePicker;

export default observer(()=>{
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(0);
    const [ nextRunTime, setNextRunTime ] = useState(null);
    const info = store.record;
    const handleCancel = () => {
        store.formVisible = false;
    }
    const handlePrevious = () => {
        if (page !== 0) {
            setPage(page - 1);
        }
    }
    const handleSubmit = () => {
        const data = form.getFieldsValue();
        if (page == 0 ) {
            setPage(1);
            store.record.hosts = data.hosts;
            store.record.origin_db_name = data.origin_db_name;
            store.record.origin_tb_name = data.origin_tb_name;
            store.record.origin_time_range = data.origin_time_range;
        } else if ( page == 1) {
            setPage(2)
            store.record.hosts = data.hosts;
            store.record.backup_db_name = data.backup_db_name;
            store.record.backup_hosts = data.backup_hosts;
            store.record.backup_db_name = data.backup_db_name;
        } else if ( page == 2) {
            store.record.every_x = data.every_x;
            store.record.only_once = data.only_once;
            store.record.unix_cron = data.unix_cron;
            store.record.unix_cron_active_time = data.unix_cron_active_time;
            store.record.unix_cron_deactive_time = data.unix_cron_deactive_time;
        }
        console.log(store.record);
    }
    const onSelectChange = () => {}
    const handleArgs = () => {}
    const handleCronArgs = () => {}


    const time_ranges = [
        {"key": "1", "value": "最近3天"},
        {"key": "2", "value": "最近1周"},
        {"key": "3", "value": "最近2周"},
        {"key": "4", "value": "最近1个月"},
        {"key": "5", "value": "最近3个月"},
        {"key": "6", "value": "最近6个月"},
        {"key": "7", "value": "最近1年"},
        {"key": "8", "value": "最近3年"},
        {"key": "9", "value": "最近5年"},
        {"key": "10", "value": "最近10年"},
      ]
    
    return (<Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑迁移策略' : '新建迁移策略'}
        confirmLoading={ loading }
        onCancel={ handleCancel }
        cancelText={ page == 0 ? '' : '' }
        footer={[
            <Button key="submit" type="primary" onClick={ handleCancel }>
              取消
            </Button>,
            <Button key="back" onClick={ handlePrevious } hidden={ page === 0 }>
              上一步 
            </Button>,
            <Button
              key="link"
              type="primary"
              onClick={ handleSubmit }
            >
              {page == 2 ? '确定' : '下一步' }
            </Button>,
          ]}
        onOk={ handleSubmit }>
        <Steps current={page} className={styles.steps}>
          <Steps.Step key={0} title="源数据"/>
          <Steps.Step key={1} title="目的数据"/>
          <Steps.Step key={2} title="执行策略"/>
        </Steps>

        <Form labelCol={{span: 6}} wrapperCol={{span: 14}} form={form}>
        { page == 0 && <>
            <Form.Item required label="选择源主机" name='hosts'>
              <Select placeholder="请选择数据库主机">
                  {store.hosts.map(item => (
                    <Select.Option value={item.hostname} key={item.id}>{item.hostname}</Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item required label="数据库名称" name='origin_db_name'>
              <Input placeholder="请输入数据库名称"/>
            </Form.Item>
            <Form.Item required label="数据表名称" name="origin_tb_name">
              <Input placeholder="请输入数据库名称"/>
            </Form.Item>
          <Form.Item required label="选择时间段" name='origin_time_range'>
            <Select
              placeholder="请选数据迁移时间段"
              onChange={onSelectChange}
              dropdownRender={menu => (
              <div>
                { menu }
                <Divider style={{ margin: '4px 0' }} />
              </div>
              )}
            >
              {time_ranges.map(item => (
                <Select.Option value={item.key} key={item.key}>{item.value}</Select.Option>
              ))}
            </Select>
          </Form.Item>
         </>
        }
        { page == 1 && <>
            <Form.Item required label="选择备份主机" name="backup_hosts">
              <Select placeholder="请选择数据库主机">
                {store.hosts.map(item => (
                  <Select.Option value={item.hostname} key={item.id}>{item.hostname}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item required label="数据库名称" name="backup_db_name">
              <Input placeholder="请输入数据库名称"/>
            </Form.Item>
            <Form.Item required label="数据表名称">
              <Input placeholder="请输入数据库名称"/>
            </Form.Item>
         </>
        }
        { page == 2 && <>
            <Tabs tabPosition="left" style={{minHeight: 200}}>
              <Tabs.TabPane tab="普通间隔" key="interval">
                <Form.Item required label="间隔时间(秒)" extra="每隔指定n秒执行一次。" name="every_x">
                  <InputNumber
                    style={{width: 150}}
                    placeholder="请输入"
                    value={info['interval']}
                    onChange={v => handleArgs('interval', v)}/>
                </Form.Item>
              </Tabs.TabPane>
              <Tabs.TabPane tab="一次性" key="date">
                <Form.Item required label="执行时间" extra="仅在指定时间运行一次。" name="only_once">
                  <DatePicker
                    showTime
                    disabledDate={v => v && v.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')}
                    style={{width: 150}}
                    placeholder="请选择执行时间"
                    onOk={() => false}
                    value={info['date'] ? moment(info['date']) : undefined}
                    onChange={v => handleArgs('date', v)}/>
                </Form.Item>
              </Tabs.TabPane>
              <Tabs.TabPane tab="UNIX Cron" key="cron">
                <Form.Item required label="执行规则" help="兼容Cron风格，可参考官方例子" name="unix_cron">
                  <Input
                    suffix={ nextRunTime || <span/>}
                    value={lds.get(info, 'cron.rule')}
                    placeholder="例如每天凌晨1点执行：0 1 * * *"
                    onChange={e => handleCronArgs('rule', e.target.value)}/>
                </Form.Item>
                <Form.Item label="生效时间" help="定义的执行规则在到达该时间后生效" name="unix_cron_active_time">
                  <DatePicker
                    showTime
                    style={{width: '100%'}}
                    placeholder="可选输入"
                    value={lds.get(info, 'cron.start') ? moment(info['cron']['start']) : undefined}
                    onChange={v => handleCronArgs('start', v)}/>
                </Form.Item>
                <Form.Item label="结束时间" help="执行规则在到达该时间后不再执行" name="unix_cron_deactive_time">
                  <DatePicker
                    showTime
                    style={{width: '100%'}}
                    placeholder="可选输入"
                    value={lds.get(info, 'cron.stop') ? moment(info['cron']['stop']) : undefined}
                    onChange={v => handleCronArgs('stop', v)}/>
                </Form.Item>
              </Tabs.TabPane>
              <Tabs.TabPane disabled tab="日历间隔" key="calendarinterval">
              </Tabs.TabPane>
            </Tabs>
         </>
        }
        </Form>
        </Modal>);
});