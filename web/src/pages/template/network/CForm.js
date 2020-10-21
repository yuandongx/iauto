
import React, {useState} from 'react';
import { observer } from 'mobx-react';
import { SyncOutlined } from '@ant-design/icons';
import { Collapse, Modal, Input, Select, Button, Tabs, Card, Typography, Divider, Form, Space } from 'antd';
import { http } from 'libs';
import { SearchForm } from "components"
import store from './store';
import platforms from "./platforms"
import ComTable from './Table';
import * as Address from "./address";
import * as Service from "./service";

const { TabPane } = Tabs;

/****/
const SubTabPane = observer(({platform, form}) => {
  // eslint-disable-next-line
  const [allFields, setAllFields] = useState();
  const onChange = () => {
    setAllFields(form.getFieldsValue());
  }
  return (
    <Tabs tabPosition='left' onChange={onChange}>
    {platform.features.map((item)=>(
      <TabPane tab={item.description} key={platform.platform + item.name}>
        {item.name === "address" && <Address.Address form={form} platform={platform.platform} />}
        {item.name === "address-group" && <Address.AddressGroup form={form} platform={platform.platform} />}
        {item.name === "service" && <Service.Service form={form} platform={platform.platform} />}
        {item.name === "service-group" && <Service.ServiceGroup form={form} platform={platform.platform} />}
      </TabPane>
    ))}
    </Tabs>
  );
});

const ListView = observer(() => {
  var result = [];
  const renderData = () => {
    if(store.result_data !== null && store.result_data.lines !== undefined){
      for(let k in store.result_data.lines) {
        let p = k.split("_")[0];
        let l = store.result_data.lines[k].filter(item => item !== "");
        result.push({platform: p, lines: l});
      }
    }
    return result
  }

  const data = renderData();
  return (
    <>
      {data.length !== 0 && <Divider orientation="left">预览配置</Divider>}
      <Collapse accordion>
        {data.map(entry => (

          <Collapse.Panel
            header={entry.platform}
            key={entry.platform}>
              {entry.lines.map((line, index) => (
                <p key={line + index}>{line}</p> ))
              }
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
});

const InfoMadal = observer(({visible, handleModalOK, handleModalCancle}) => {
  const [form] = Form.useForm();
  const onOK = () => {
    form.submit();
    const data = form.getFieldsValue();
    console.log(data);
    handleModalOK(data);
  }
  const onCancle = () => {
    handleModalCancle();
  }
  return (
    <Modal
      title="输入模板信息"
      onOk={onOK}
      visible={visible}
      onCancel={onCancle}
      >
      <Form form={form}>
        <Form.Item
          label="模版名称"
          name="template_name"
          rules={[{ required: true, message: '请输入模版名称!' }]}
        >
          <Input />
        </Form.Item>

          <Form.Item
            label="模版类型"
            name="template_type"
            rules={[{ required: true, message: '请输入模版类型!' }]}
          >
            <Input />
        </Form.Item>

          <Form.Item
            label="描述信息"
            name="template_description"
            rules={[{ required: true, message: '请输入模版描述信息!' }]}
          >
            <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default observer(()=>{
    const [activeKey, setActiveKey] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState();
    const [form] = Form.useForm();
    const tabChange = (activeKey) => {
      setActiveKey(activeKey);
    }
    const handleSubmit1 = (e) => {

      let data = form.getFieldsValue();
      data.save = false;
      http.post("/api/template/network/", data).then((result) => {
        store.saveData(result);
      });
    }
    const handleSubmit2 = (e) => {
      setShowModal(true);
      setLoading(true);
    }
    const handleModalCancle = () => {
      setShowModal(false);
    }
    const handleModalOK = (info) => {
      setShowModal(false);
      setInfo(info);
      let data = form.getFieldsValue();
      Object.assign(data, info);
      console.log(info);
      console.log(data);
      data.save = true;
      http.post("/api/template/network/", data).then((result) => {
        console.log(result);
      });
      setLoading(false);
    }
    return(
        <>
        <Tabs onChange={tabChange} size="large">
          <TabPane tab="模板汇总" key="all">
            <SearchForm>
              <SearchForm.Item span={8} title="平台类型">
                <Select allowClear value={store.f_type} onChange={v => store.f_type = v} placeholder="请选择">
                  {platforms.map(item => (
                    <Select.Option value={item.platform} key={item.platform}>{item.platform}</Select.Option>
                  ))}
                </Select>
              </SearchForm.Item>
              <SearchForm.Item span={8} title="模版名称">
                <Input allowClear value={store.f_name} onChange={e => store.f_name = e.target.value} placeholder="请输入"/>
              </SearchForm.Item>
              <SearchForm.Item span={8}>
                <Button type="primary" icon={<SyncOutlined />} onClick={store.fetchRecords}>刷新</Button>
              </SearchForm.Item>
            </SearchForm>
          </TabPane>
          {platforms.map((item) => (
            <TabPane tab={item.description} key={item.platform}>
              <SubTabPane platform={item} form={form}/>
            </TabPane>
          ))}
        </Tabs>
        {activeKey === "all" && <ComTable />}
        {activeKey !== "all" &&
        <Space align="center" style={{marginLeft: "10%"}}>
          <Button type="primary" onClick={handleSubmit1}>
            生成配置
          </Button>
          <Button type="primary" onClick={handleSubmit2}  loading={loading}>
            提交配置
          </Button>
          </Space>}
          {activeKey !== "all" && <ListView />}
          {showModal && <InfoMadal visible={showModal} handleModalOK={handleModalOK} handleModalCancle={handleModalCancle}/>}
        </>
    );
});
