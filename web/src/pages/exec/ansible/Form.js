
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, Select, Col, Button, Steps, Icon, message, Tag } from 'antd';
import { LinkButton } from 'components';
import TemplateSelector from './TemplateSelector';
import { http, hasHostPermission } from 'libs';
import store from './store';
import hostStore from '../../host/store';
import styles from './index.module.css';
import moment from 'moment';
import lds from 'lodash';

@observer
class ComForm extends React.Component {
  constructor(props) {
    super(props);
    this.isFirstRender = true;
    this.lastFetchId = 0;
    this._fetchNextRunTime = lds.debounce(this._fetchNextRunTime, 500);
    this.state = {
      loading: false,
      type: null,
      page: 0,
      nextRunTime: null,
      args: {[store.record['trigger']]: store.record['trigger_args']},
      playbooks: [],
    }
  }

  componentDidMount() {
    store.targets = store.record.id ? store.record['targets'] : [undefined];
    if (hostStore.records.length === 0) {
      hostStore.fetchRecords()
    }
  }
  _parse_args = (trigger) => {
    switch (trigger) {
      case 'date':
        return moment(this.state.args['date']).format('YYYY-MM-DD HH:mm:ss');
      case 'cron':
        const {rule, start, stop} = this.state.args['cron'];
        return JSON.stringify({
          rule,
          start: start ? moment(start).format('YYYY-MM-DD HH:mm:ss') : null,
          stop: stop ? moment(stop).format('YYYY-MM-DD HH:mm:ss') : null
        });
      default:
        return this.state.args[trigger];
    }
  };

  handleSubmit = () => {
    const formData = this.props.form.getFieldsValue();
    if (formData['trigger'] === 'date' && this.state.args['date'] <= moment()) {
      return message.error('任务执行时间不能早于当前时间')
    }
    this.setState({loading: true});
    formData['id'] = store.record.id;
    formData['playbooks'] = this.state.playbooks;
    formData['targets'] = store.targets.filter(x => x);
    formData['trigger_args'] = this._parse_args(formData['trigger']);
    http.post('/api/exec/ansible/', formData)
      .then(res => {
        message.success('操作成功');
        store.formVisible = false;
        store.fetchRecords()
      }, () => this.setState({loading: false}))
  };

  handleAddZone = () => {
    Modal.confirm({
      icon: 'exclamation-circle',
      title: '添加任务类型',
      content: this.addZoneForm,
      onOk: () => {
        if (this.state.type) {
          store.types.push(this.state.type);
          this.props.form.setFieldsValue({'type': this.state.type})
        }
      },
    })
  };

  addZoneForm = (
    <Form>
      <Form.Item required label="任务类型">
        <Input onChange={val => this.setState({type: val.target.value})}/>
      </Form.Item>
    </Form>
  );

  handleArgs = (type, value) => {
    const args = Object.assign(this.state.args, {[type]: value});
    this.setState({args})
  };

  handleCronArgs = (key, value) => {
    let args = this.state.args['cron'] || {};
    args = Object.assign(args, {[key]: value});
    this.setState({args: Object.assign(this.state.args, {cron: args})}, () => {
      if (key === 'rule') {
        value = value.trim();
        if (value.split(' ').length === 5) {
          this.setState({nextRunTime: <Icon type="loading"/>});
          this._fetchNextRunTime()
        } else {
          this.setState({nextRunTime: null})
        }
      } else {
        this.setState({nextRunTime: <Icon type="loading"/>});
        this._fetchNextRunTime()
      }
    });
  };

  _fetchNextRunTime = () => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const args = this._parse_args('cron');
    http.post('/api/schedule/run_time/', JSON.parse(args))
      .then(({success, msg}) => {
        if (fetchId !== this.lastFetchId) return;
        if (success) {
          this.setState({nextRunTime: <span style={{fontSize: 12, color: '#52c41a'}}>{msg}</span>})
        } else {
          this.setState({nextRunTime: <span style={{fontSize: 12, color: '#ff4d4f'}}>{msg}</span>})
        }
      })
  };

  verifyButtonStatus = () => {
    const data = this.props.form.getFieldsValue();
    let b1 = data['type'] && data['name'] && this.state.playbooks.length > 0;
    const b2 = store.targets.filter(x => x).length > 0;
    /**const b3 = this.state.args[data['trigger']];**/
    if (!b1 && this.isFirstRender && store.record.id) {
      this.isFirstRender = false;
      b1 = true
    }
    return [b1, b2];
  };
   handleClose = removedTag => {
        const playbooks = this.state.playbooks.filter(tag => tag.id !== removedTag.id);
        this.setState({ playbooks });
   };
  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag.name}
      </Tag>
    );
    return (
      <span key={tag.id} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };
  render() {
    const info = store.record;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {page, _, playbooks, loading, showTmp, } = this.state;
    const [b1, b2] = this.verifyButtonStatus();
    const tags = playbooks.map((item) => this.forMap({name:item.name, id:item.id}));
    // console.log(playbooks);
    return (
      <Modal
        visible
        width={800}
        maskClosable={false}
        title={store.record.id ? '编辑任务' : '新建任务'}
        okText={page === 0 ? '下一步' : '确定'}
        onCancel={() => store.formVisible = false}
        footer={null}>
        <Steps current={page} className={styles.steps}>
          <Steps.Step key={0} title="创建任务"/>
          <Steps.Step key={1} title="选择执行对象"/>
        </Steps>
        <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <div style={{display: page === 0 ? 'block' : 'none'}}>
            <Form.Item required label="任务类型">
              <Col span={16}>
                {getFieldDecorator('type', {initialValue: info['type']})(
                  <Select placeholder="请选择任务类型">
                    {store.types.map(item => (
                      <Select.Option value={item} key={item}>{item}</Select.Option>
                    ))}
                  </Select>
                )}
              </Col>
              <Col span={6} offset={2}>
                <Button type="link" onClick={this.handleAddZone}>添加类型</Button>
              </Col>
            </Form.Item>
            <Form.Item required label="任务名称">
              {getFieldDecorator('name', {initialValue: info['name']})(
                <Input placeholder="请输入任务名称"/>
              )}
            </Form.Item>
            <Form.Item
              required
              label="任务内容"
              extra={<LinkButton onClick={() => this.setState({showTmp: true})}>从模板添加</LinkButton>}>
              {tags}
            </Form.Item>
            <Form.Item label="失败通知" extra={<span>
              任务执行失败告警通知，
              <a target="_blank" rel="noopener noreferrer" href="help">钉钉收不到通知？</a>
            </span>}>
              {getFieldDecorator('rst_notify.value', {initialValue: info['rst_notify']['value']})(
                <Input
                  addonBefore={getFieldDecorator('rst_notify.mode', {initialValue: info['rst_notify']['mode']})(
                    <Select style={{width: 100}}>
                      <Select.Option value="0">关闭</Select.Option>
                      <Select.Option value="1">钉钉</Select.Option>
                      <Select.Option value="3">企业微信</Select.Option>
                      <Select.Option value="2">Webhook</Select.Option>
                    </Select>
                  )}
                  disabled={getFieldValue('rst_notify.mode') === '0'}
                  placeholder="请输入"/>
              )}
            </Form.Item>
            <Form.Item label="备注信息">
              {getFieldDecorator('desc', {initialValue: info['desc']})(
                <Input.TextArea placeholder="请输入模板备注信息"/>
              )}
            </Form.Item>
          </div>
          <div style={{minHeight: 224, display: page === 1 ? 'block' : 'none'}}>
            <Form.Item required label="执行对象">
              {store.targets.map((id, index) => (
                <React.Fragment key={index}>
                  <Select
                    value={id}
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    style={{width: '80%', marginRight: 10}}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={v => store.editTarget(index, v)}>
                    <Select.Option value="local" disabled={store.targets.includes('local')}>本机</Select.Option>
                    {hostStore.records.filter(x => x.id === id || hasHostPermission(x.id)).map(item => (
                      <Select.Option key={item.id} value={item.id} disabled={store.targets.includes(item.id)}>
                        {`${item.name}(${item['hostname']}:${item['port']})`}
                      </Select.Option>
                    ))}
                  </Select>
                  {store.targets.length > 1 && (
                    <Icon className={styles.delIcon} type="minus-circle-o" onClick={() => store.delTarget(index)}/>
                  )}
                </React.Fragment>
              ))}
            </Form.Item>
            <Form.Item wrapperCol={{span: 14, offset: 6}}>
              <Button type="dashed" style={{width: '80%'}} onClick={store.addTarget}>
                <Icon type="plus"/>添加执行对象
              </Button>
            </Form.Item>
          </div>
          
          <Form.Item wrapperCol={{span: 14, offset: 6}}>
            {page === 1 &&
            <Button disabled={!b2} type="primary" onClick={this.handleSubmit} loading={loading}>提交</Button>}
            {page === 0 &&
            <Button disabled={!b1} type="primary" onClick={() => this.setState({page: page + 1})}>下一步</Button>}
            {page !== 0 &&
            <Button style={{marginLeft: 20}} onClick={() => this.setState({page: page - 1})}>上一步</Button>}
          </Form.Item>
        </Form>
        {showTmp && <TemplateSelector
          onOk={playbooks => this.setState({playbooks})}
          onCancel={() => this.setState({showTmp: false})}/>}
      </Modal>
    )
  }
}

export default Form.create()(ComForm)
