import React, {useState} from 'react';
import { observer } from 'mobx-react';
import { SyncOutlined } from '@ant-design/icons';
import { Collapse,
         Modal,
         Input,
         Select,
         Button,
         Tabs,
         Divider,
         Form,
         message,
         Space } from 'antd';
import { http } from 'libs';
import { SearchForm } from "components"
import store from './store';
import platforms from "./platforms"
import ComTable from './Table';
import * as Address from "./address";
import * as Service from "./service";
import TimeRange from "./time";
import AsaAcl from "./asa_acl";
import TopsecFWPolicy from "./topsec_fwplicy";

const { TabPane } = Tabs;

/****/
@observer
class SubTabPane extends React.Component {

  render (){
    return (
      <Tabs tabPosition='left'>
      {this.props.platform.features.map((item)=>(
        <TabPane tab={item.description} key={this.props.platform.platform + item.name + this.props.tag}>
          {item.name === "address" && <Address.Address {...this.props} platform={this.props.platform.platform} />}
          {item.name === "address-group" && <Address.AddressGroup {...this.props} platform={this.props.platform.platform} />}
          {item.name === "service" && <Service.Service {...this.props} platform={this.props.platform.platform} />}
          {item.name === "service-group" && <Service.ServiceGroup {...this.props} platform={this.props.platform.platform} />}
          {item.name === "time-range" && <TimeRange {...this.props} platform={this.props.platform.platform} />}
          {item.name === "asa-acl" && <AsaAcl {...this.props} platform="asa"/>}
          {item.name === "topsec-fw-policy" && <TopsecFWPolicy {...this.props}/>}
        </TabPane>
      ))}
      </Tabs>
    );
  }
}

const ListView = observer(() => {
  const renderData = () => {
    var result = {};
    if(store.result_data !== null && store.result_data.lines !== undefined){
      for(let k in store.result_data.lines) {
        let p = k.split("_")[0];
        let l = store.result_data.lines[k].filter(item => item !== "");
        if(result[p] === undefined) {
          result[p] = l;
        } else {
          result[p] = [...result[p], ...l]
        }
      }
    }
    return result
  }

  const data = renderData();
  return (
    <>
      {Object.keys(data).length !== 0 && <Divider>配置命令行预览</Divider>}
      <Collapse accordion>
        {Object.entries(data).map(entry => (
          <Collapse.Panel
            header={entry[0]}
            key={entry[0]}>
              {entry[1].map((line, index) => (
                <div style={{marginRight: 2}} key={line + index}>
        {!line.startsWith(" ") && <p>{line}</p>}
        {line.startsWith(" ") && <p style={{marginLeft: 15}}>{line}</p>}
        </div>
        ))
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
    const [tag, setTag] = useState(0);
    const [form] = Form.useForm();

    const tabChange = (activeKey) => {
      setActiveKey(activeKey);
    }

    const handleSubmit1 = (e) => {
      let data = form.getFieldsValue();
      data.save = false;
      data.platform = activeKey;
      console.log(data);
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
      setLoading(false);
    }
    const handleModalOK = (info) => {
      setShowModal(false);
      let data = form.getFieldsValue();
      Object.assign(data, info);
      data.save = true;
      data.platform = activeKey;
      http.post("/api/template/network/", data).then((result) => {
        form.resetFields();
        setActiveKey("all");
        setTag(tag + 1);
        message.success("保存成功！");
      });
      setLoading(false);
    }
    return(
        <>
        <Tabs onChange={tabChange} size="large" activeKey={activeKey}>
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
              <SubTabPane tag={tag} platform={item} form={form}/>
            </TabPane>
          ))}
        </Tabs>
        {activeKey === "all" && <ComTable />}
        {activeKey !== "all" &&
        <Space style={{marginLeft: "40%", marginTop: "1%", marginBottom: "1%"}}>
          <Button type="primary" onClick={handleSubmit1}>
            预览配置
          </Button>
          <Button type="primary" onClick={handleSubmit2}  loading={loading}>
            保存配置
          </Button>
        </Space>}
          {activeKey !== "all" && <ListView />}
          {showModal && <InfoMadal visible={showModal} handleModalOK={handleModalOK} handleModalCancle={handleModalCancle}/>}
        </>
    );
});
