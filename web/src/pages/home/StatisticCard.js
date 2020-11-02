
import React from 'react';
import {Card, Row, Col} from 'antd';
import Hostinfo from './Hostinfo';
import Taskinfo from './Taskinfo';
import Templateinfo from './Templateinfo';

export default class StatisticCard extends React.Component {
  render() {
    return (
      <Row gutter={16} style={{marginBottom: 20}}>
        <Col span={8}>
          <Card title="主机分类" style={{height: 350}}>
            <Hostinfo/>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="任务分类" style={{height: 350}}>
            <Taskinfo/>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="模板分类" style={{height: 350}}>
            <Templateinfo/>
          </Card>
        </Col>
      </Row>
    )
  }
}
