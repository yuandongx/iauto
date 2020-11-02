import React from "react";
import { observer } from 'mobx-react';
import { Collapse, Modal, Input, Select, Button, Tabs, Divider, Form, Space } from 'antd';
import { http } from 'libs';

const showInfo = (key) => {
  http.get(`/api/template/network/detaile/?id=${key}`).then(
    result => {
      console.log(result);
    }
  );
}
export default showInfo;