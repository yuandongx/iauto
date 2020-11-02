import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Pie } from '@ant-design/charts';
import { http } from 'libs';

const Templateinventory: React.FC = () => {
  const [tempinfo, setData] = useState([]);
  useEffect(() => {
    asyncGet();
  }, []);
  const asyncGet = () => {
    http.get('/api/home/statistic/templateinfo/')
      .then((res) => setData(res))
      .catch((error) => console.info(error))
  };
  const dataSource = tempinfo["temp_list"];
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
	  ellipsis: true,
	  filters: tempinfo["name_filter_list"],
      onFilter: (value, record) => record.name === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
	  ellipsis: true,
	  filters: tempinfo["type_filter_list"],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
	  ellipsis: true,
      onFilter: (value, record) => record.content === value,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
	  ellipsis: true,
      onFilter: (value, record) => record.desc === value,
    },
  ];

  return <Table dataSource={dataSource} pagination={{ pageSize: 5 }} columns={columns} />;
};
export default Templateinventory;