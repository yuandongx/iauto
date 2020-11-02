import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import { http } from 'libs';

const Taskinfo: React.FC = () => {
  const [tasktype, setData] = useState([]);
  useEffect(() => {
    asyncGet();
  }, []);
  const asyncGet = () => {
    http.get('/api/home/statistic/task/')
      .then((res) => setData(res))
      .catch((error) => console.info(error))
  };

  const data = tasktype;
  const config = {
    appendPadding: 10,
    data,
	height: 260,
    angleField: 'value',
    colorField: 'type',
	color: ['#2a5caa', '#102b6a', '#6a6da9', '#6950a1', '#694d9f', '#63434f', '#411445', '#74787c'],
    radius: 0.8,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: -20,
      autoRotate: false,
      content: '{value}',
      style: {
		fontSize: 16,
        fill: '#333',
        stroke: '#fff',
        strokeWidth: 1,
      },
    },
    statistic: {
    title: {
      offsetY: -15,
      style: {
        fontSize: 24,
      },
      formatter: (datum) => (datum ? datum.type : '总计'),
    },
    content: {
      offsetY: 15,
      style: {
        fontSize: 16,
      },
      formatter: (datum, data) => (datum ? `${datum.value} 个` : `${data.reduce((r, d) => r + d.value, 0)} 个`),
    },
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };
  return <Pie {...config} />;
};
export default Taskinfo;