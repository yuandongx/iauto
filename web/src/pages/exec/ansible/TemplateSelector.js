import React from 'react';
import { observer } from 'mobx-react';
import { SyncOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Button, Select } from 'antd';
import { SearchForm } from 'components';
import gstore from '../../template/generic/store';
import nstore from '../../template/network/store';

@observer
class TemplateSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      f_name: null,
      f_type: null,
    }
  }

  componentDidMount() {
    if (gstore.records.length === 0) {
      gstore.fetchRecords()
    }
    if (nstore.records.length === 0) {
      nstore.fetchRecords()
    }
  }

  handleSubmit = () => {
    if (this.state.selectedRows.length > 0) {
      this.props.onOk(this.state.selectedRows)
    }
    this.props.onCancel()
  };

  columns = [{
    title: '类型',
    dataIndex: 'type',
  }, {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true
  }, {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true
  }, {
    title: '备注',
    dataIndex: 'desc',
    ellipsis: true
  }];

  renderData = () => {
    let data = [];
    let types = [];
    gstore.records.forEach(function(value){
      data.push({id: value.id,
                 key: "g" + value.id,
                 type: value.type,
                 name: value.name,
                 content: value.content,
                 desc: value.desc,});
    });
    nstore.records.forEach(function(value){
      data.push({id: value.id,
                 key: "n" + value.id,
                 type: value.type,
                 name: value.name,
                 content: value.config_lines,
                 desc: value.desc,});
    });
    gstore.types.forEach(function(value){
      types.push(value);
    });
    nstore.types.forEach(function(value){
      types.push(value);
    });
    return [data, types];
  }

  render() {
    const {selectedRows} = this.state;
    let [data, types] = this.renderData();
    if (this.state.f_name) {
      data = data.filter(item => item.name.toLowerCase().includes(this.state.f_name.toLowerCase()));
    }
    if (this.state.f_type) {
      data = data.filter(item => item.type.toLowerCase().includes(this.state.f_type.toLowerCase()));
    }
    return (
      <Modal
        visible
        width={1000}
        title="选择执行模板"
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
        maskClosable={false}>
        <SearchForm>
          <SearchForm.Item span={8} title="模板类别">
            <Select allowClear placeholder="请选择" value={this.state.f_type} onChange={v => this.setState({f_type: v})}>
              {types.map(item => (
                <Select.Option value={item} key={item}>{item}</Select.Option>
              ))}
            </Select>
          </SearchForm.Item>
          <SearchForm.Item span={8} title="模板名称">
            <Input allowClear value={this.state.f_name} onChange={e => this.setState({f_name: e.target.value})} placeholder="请输入"/>
          </SearchForm.Item>
          <SearchForm.Item span={8}>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={() => {nstore.fetchRecords();gstore.fetchRecords();}}>刷新</Button>
          </SearchForm.Item>
        </SearchForm>
        <Table
          rowKey="key"
          rowSelection={{
            selectedRowKeys: selectedRows.map(item => item.key),
            onChange: (selectedRowKeys, selectedRows) => this.setState({selectedRows})
          }}
          dataSource={data}
          loading={nstore.isFetching || gstore.isFetching}
          columns={this.columns}/>
      </Modal>
    );
  }
}

export default TemplateSelector
