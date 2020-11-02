import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { http } from 'libs';

const Hostinventory: React.FC = () => {
  const [hostinfo, setData] = useState([]);
  useEffect(() => {
    asyncGet();
  }, []);
  const asyncGet = () => {
    http.get('/api/home/statistic/hostinfo/')
      .then((res) => setData(res))
      .catch((error) => console.info(error))
  };

  const dataSource = hostinfo["host_list"];
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
	  ellipsis: true,
	  filters: hostinfo["name_filter_list"],
      onFilter: (value, record) => record.name === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
	  ellipsis: true,
	  filters: hostinfo["type_filter_list"],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '主机地址',
      dataIndex: 'address',
      key: 'address',
	  filters: hostinfo["addr_filter_list"],
      onFilter: (value, record) => record.address === value,
    },
    {
      title: '用户名',
      dataIndex: 'user',
      key: 'user',
	  ellipsis: true,
	  filters: hostinfo["user_filter_list"],
      onFilter: (value, record) => record.user === value,
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
	  ellipsis: true,
	  filters: hostinfo["port_filter_list"],
      onFilter: (value, record) => record.port === value,
    },
  ];

  return <Table dataSource={dataSource} pagination={{ pageSize: 5 }} columns={columns} />;
};
export default Hostinventory;