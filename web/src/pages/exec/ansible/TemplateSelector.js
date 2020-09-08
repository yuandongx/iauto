import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Table, Input, Button, Select } from 'antd';
import { SearchForm } from 'components';
import store from '../../template/generic/store';

@observer
class TemplateSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
    }
  }

  componentDidMount() {
    if (store.records.length === 0) {
      store.fetchRecords()
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
    dataIndex: 'label',
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

  render() {
    const {selectedRows} = this.state;
    let data = store.records;
    if (store.f_name) {
      data = data.filter(item => item['name'].toLowerCase().includes(store.f_name.toLowerCase()))
    }
    if (store.f_type) {
      data = data.filter(item => item['label'].toLowerCase().includes(store.f_type.toLowerCase()))
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
            <Select allowClear placeholder="请选择" value={store.f_type} onChange={v => store.f_type = v}>
              {store.types.map(item => (
                <Select.Option value={item} key={item}>{item}</Select.Option>
              ))}
            </Select>
          </SearchForm.Item>
          <SearchForm.Item span={8} title="模板名称">
            <Input allowClear value={store.f_name} onChange={e => store.f_name = e.target.value} placeholder="请输入"/>
          </SearchForm.Item>
          <SearchForm.Item span={8}>
            <Button type="primary" icon="sync" onClick={store.fetchRecords}>刷新</Button>
          </SearchForm.Item>
        </SearchForm>
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedRows.map(item => item.id),
            onChange: (selectedRowKeys, selectedRows) => this.setState({selectedRows})
          }}
          dataSource={data}
          loading={store.isFetching}
          columns={this.columns}/>
      </Modal>
    )
  }
}

export default TemplateSelector
