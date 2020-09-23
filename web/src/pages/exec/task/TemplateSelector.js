
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
      filter_type: "",
      filter_name: "",
    }
  }

  componentDidMount() {
    if (store.records.length === 0) {
      store.fetchRecords()
    }
  }

  handleClick = (record) => {
    this.setState({selectedRows: [record]});
  };

  handleSubmit = () => {
    if (this.state.selectedRows.length > 0) {
      this.props.onOk(this.state.selectedRows[0].content)
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
    let row_select_type = this.props.row_select_type === undefined ? 'radio' : 'checkbox';
    if (this.state.filter_name !== "") {
      data = data.filter(item => item['name'].toLowerCase().includes(this.state.filter_name.toLowerCase()));
    }
    if (this.state.filter_type !== "" && this.state.filter_type !== undefined) {
      data = data.filter(item => item['label'].toLowerCase() === this.state.filter_type.toLowerCase());
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
            <Select allowClear placeholder="请选择" value={this.state.filter_type} onChange={v => this.setState({filter_type: v})}>
              {store.types.map(item => (
                <Select.Option value={item} key={item}>{item}</Select.Option>
              ))}
            </Select>
          </SearchForm.Item>
          <SearchForm.Item span={8} title="模板名称">
            <Input allowClear value={this.state.filter_name} onChange={e => this.setState({filter_name: e.target.value})} placeholder="请输入"/>
          </SearchForm.Item>
          <SearchForm.Item span={8}>
            <Button type="primary" icon="sync" onClick={store.fetchRecords}>刷新</Button>
          </SearchForm.Item>
        </SearchForm>
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedRows.map(item => item.id),
            type: row_select_type,
            onChange: (_, selectedRows) => this.setState({selectedRows})
          }}
          dataSource={data}
          loading={store.isFetching}
          onRow={record => {
            return {
              onClick: () => this.handleClick(record)
            }
          }}
          columns={this.columns}/>
      </Modal>
    )
  }
}

export default TemplateSelector
