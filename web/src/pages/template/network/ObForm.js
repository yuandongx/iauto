/***
*
***/
import http from 'libs/http';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { LineOutlined } from '@ant-design/icons';
import { Modal, Tabs, Form, Card } from 'antd';
import store from './store';
import * as TheForms from './forms';
const {TabPane} = Tabs;

const TheForm = ({handleData, formFlag})=>{
    return(<>
            {formFlag === "address" && <TheForms.Address handleData={handleData}/>}
           </>
    );
}

@observer
class FeatureTabs extends React.Component {
    filter = ()=> {
        let items = new Array();
        for (let i=0; i<store.types.length; i++){
            if (store.types[i].platform === store.formFlag){
                let features = store.types[i].features;
                for (let x in features){
                    items.push({name:x, description:features[x]});
                }
            }
            
        }
        return items;
    }
    onTabChange = activeKey => {
        console.log("onTabChange:"+activeKey);
    }
    onTabScroll = direction => {
        console.log("onTabScroll:"+direction);
    }
    onTabClick = (key, event) => {
        console.log("onTabClick:"+key);
        console.log(event);
    }
    handleData = data => {
        console.log(data);
        store.saveData(data);
    }
    render(){
      const items = this.filter();
      return(<Card><Tabs tabPosition="left"
                onChange={this.onTabChange}
                onTabScroll={this.onTabScroll}
                onTabClick={this.onTabClick}>
      {items.map(item=>(<TabPane tab={item.description} key={item.name}>
                          <TheForm handleData={this.handleData} formFlag={item.name}/>
                        </TabPane>
                        )
                )
        }
      </Tabs></Card>);
    }
}
@observer
class Display extends React.Component {
    render(){
        return(<>
        {store.commands !== undefined && <Card>
            
        </Card>}
        </>);
    };
}
export default observer(() => {
    return(
      <Modal
        visible
        width={1000}
        maskClosable={false}
        title={store.record.id ? '编辑地址对象' : '新建地址对象'}
        // confirmLoading={modalState}
        onCancel={() => store.formFlag = null}
        // onOk={modalSubmit}
        >
        <FeatureTabs/>
      </Modal>
    );
});