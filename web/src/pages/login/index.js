/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { CopyrightOutlined, GithubOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Tabs, Modal } from 'antd';
import styles from './login.module.css';
import history from 'libs/history';
import {http, updatePermissions} from 'libs';
import logo from 'layout/logo-spug-txt.png';
import envStore from 'pages/config/environment/store';
import appStore from 'pages/config/app/store';
import requestStore from 'pages/deploy/request/store';
import execStore from 'pages/exec/task/store';
import hostStore from 'pages/host/store';

class LoginIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginType: 'default'
    }
  }

  componentDidMount() {
    envStore.records = [];
    appStore.records = [];
    requestStore.records = [];
    requestStore.deploys = [];
    hostStore.records = [];
    execStore.hosts = [];
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, formData) => {
      if (!err) {
        this.setState({loading: true});
        formData['type'] = this.state.loginType;
        http.post('/api/account/login/', formData)
          .then(data => {
            if (!data['has_real_ip']) {
              Modal.warning({
                title: '安全警告',
                className: styles.tips,
                content: <div>
                  未能获取到客户端的真实IP，无法提供基于请求来源IP的合法性验证，详细信息请参考
                  <a target="_blank" href="https://spug.dev" rel="noopener noreferrer">官方文档</a>。
                </div>,
                onOk: () => this.doLogin(data)
              })
            } else {
              this.doLogin(data)
            }
          }, () => this.setState({loading: false}))
      }
    })
  };

  doLogin = (data) => {
    localStorage.setItem('token', data['access_token']);
    localStorage.setItem('nickname', data['nickname']);
    localStorage.setItem('is_supper', data['is_supper']);
    localStorage.setItem('permissions', JSON.stringify(data['permissions']));
    localStorage.setItem('host_perms', JSON.stringify(data['host_perms']));
    updatePermissions(data['is_supper'], data['host_perms'], data['permissions']);
    if (history.location.state && history.location.state['from']) {
      history.push(history.location.state['from'])
    } else {
      history.push('/welcome/index')
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <div><img className={styles.logo} src={logo} alt="logo"/></div>
          <div className={styles.desc}>灵活、强大、功能全面的开源运维平台</div>
        </div>
        <div className={styles.formContainer}>
          <Tabs className={styles.tabs} onTabClick={e => this.setState({loginType: e})}>
            <Tabs.TabPane tab="普通登录" key="default"/>
            <Tabs.TabPane tab="LDAP登录" key="ldap"/>
          </Tabs>
          <Form>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('username', {rules: [{required: true, message: '请输入账户'}]})(
                <Input
                  size="large"
                  autoComplete="off"
                  placeholder="请输入账户"
                  prefix={<UserOutlined className={styles.icon} />}/>
              )}
            </Form.Item>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('password', {rules: [{required: true, message: '请输入密码'}]})(
                <Input
                  size="large"
                  type="password"
                  autoComplete="off"
                  placeholder="请输入密码"
                  onPressEnter={this.handleSubmit}
                  prefix={<LockOutlined className={styles.icon} />}/>
              )}
            </Form.Item>
          </Form>

          <Button
            block
            size="large"
            type="primary"
            className={styles.button}
            loading={this.state.loading}
            onClick={this.handleSubmit}>登录</Button>
        </div>

        <div className={styles.footerZone}>
          <div className={styles.linksZone}>
            <a className={styles.links} title="Github" href="https://github.com/yuandongx/iauto"  target="_blank"
               rel="noopener noreferrer"><GithubOutlined /></a>
          </div>
          <div style={{color: 'rgba(0, 0, 0, .45)'}}>Copyright <CopyrightOutlined /> 2020 By Iauto</div>
        </div>
      </div>
    );
  }
}

export default Form.create()(LoginIndex)
