import React from "react";
import ReactJson from 'react-json-view'
import { Modal,
         Collapse } from 'antd';
import { http } from 'libs';
const { Panel } = Collapse;

function info(data) {
  Modal.info({
    title: "模板详情",
    icon: <></>,
    content: (
      <Collapse accordion bordered={false} defaultActiveKey={['1']}>
        <Panel header="【名称】" key="1">
          {data.name}
        </Panel>
        <Panel header="【创建时间】" key="2">
          {data.created_at}
        </Panel>
        <Panel header="【描述信息】" key="3">
          {data.desc}
        </Panel>
        <Panel header="【目标配置】" key="4">
          {data.config_lines.split("\n").map((l, i) => (<p key={l + i}>{l}</p>)) }
        </Panel>
        <Panel header="【原始参数】" key="5">
          <ReactJson
          collapseStringsAfterLength={20}
          displayDataTypes={false}
          name="parameter"
          collapsed={1}
          enableClipboard={false}
          src={JSON.parse(data.parameter.replace(/'/g, '"'))}/>
          </Panel>
      </Collapse>
    ),
    onOk() {},
  });
}
const showInfo = (key) => {
  http.get(`/api/template/network/detaile/?id=${key}`).then(
    result => {
      console.log(result);
      info(result[0]);
    }
  );
}
export default showInfo;