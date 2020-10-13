
import React, {useState} from 'react';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { List, Input, Select, Button, Tabs, Card, Typography, Divider, Form, Space } from 'antd';
import { ACEditor } from 'components';
import { http, cleanCommand } from 'libs';
import { SearchForm } from "components"
import store from './store';
import platforms from "./platforms"
import ComTable from './Table';
import * as SubForms from "./forms";

const { TabPane } = Tabs;

const SubTabPane = observer(({platform, form}) => {
  return (
    <Tabs tabPosition='left'>
    {platform.features.map((item)=>(
      <TabPane tab={item.description} key={platform.platform + item.name}>
        {item.name === "address" && <SubForms.Address form={form}/>}
        {item.name === "address-group" && <SubForms.AddressGroup form={form}/>}
        {item.name === "service" && <SubForms.Service form={form}/>}
        {item.name === "service-group" && <SubForms.ServiceGroup form={form}/>}
      </TabPane>
    ))}
    </Tabs>
  );
});
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];
const ListView = observer(() => {
  return (
    <>
      <Divider orientation="left">Default Size</Divider>
      <List
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>[ITEM]</Typography.Text> {item}
          </List.Item>
        )}
      />
      <Divider orientation="left">Small Size</Divider>
      <List
        size="small"
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
      <Divider orientation="left">Large Size</Divider>
      <List
        size="large"
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </>
    );
});
export default observer(()=>{
    const [activeKey, setActiveKey] = useState("all");
    const [form] = Form.useForm();
    const tabChange = (activeKey) => {
      setActiveKey(activeKey);
    }
    const handleSubmit = (e) => {
      console.log(form.getFieldsValue());
    }
    return(
        <>
        <Card>
        <Tabs onChange={tabChange}>
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
        </Card>
        {activeKey !== "all" &&
        <Space align="center" style={{marginLeft: "10%"}}>
          <Button type="primary" onClick={handleSubmit}>
            生成配置
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            提交配置
          </Button>
          </Space>}
        </>
    );
});
