/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import {Card, Row, Col} from 'antd';
import Hostinventory from './Inventory/Hostinventory';
import Templateinventory from './Inventory/Templateinventory';

export default class InventoryCard extends React.Component {
  render() {
    return (
      <Row gutter={16} style={{marginBottom: 20}}>
        <Col span={12}>
          <Card title="主机清单" style={{height: 500}}>
            <Hostinventory/>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="模型清单" style={{height: 500}}>
            <Templateinventory/>
          </Card>
        </Col>
      </Row>
    )
  }
}
