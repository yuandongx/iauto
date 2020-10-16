
import React from 'react';
import { observer } from 'mobx-react';
import { AuthCard } from 'components';
import Conetent from './CForm';

export default observer(function () {
  return (
    <AuthCard auth="exec.template.view">
      <Conetent/>
    </AuthCard>
  );
})
