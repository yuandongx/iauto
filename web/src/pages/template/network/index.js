
import React from 'react';
import { observer } from 'mobx-react';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Select, Button } from 'antd';
import { AuthDiv, AuthCard } from 'components';
import Conetent from './CForm';
import store from './store';

export default observer(function () {
  return (
    <AuthCard auth="exec.template.view">
      <Conetent/>
    </AuthCard>
  );
})
