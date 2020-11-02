import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import { http } from 'libs';

const Hostinfo: React.FC = () => {
  const [hosttype, setData] = useState([]);
  useEffect(() => {
    asyncGet();
  }, []);
  const asyncGet = () => {
    http.get('/api/home/statistic/host/')
      .then((res) => setData(res))
      .catch((error) => console.info(error))
  };

  const data = hosttype;
  const config = {
    appendPadding: 10,
    data,
	height: 260,
    angleField: 'value',
    colorField: 'type',
	color: ['#73b9a2', '#005344', '#78cdd1', '#2b6447', '#78a355', '#4d4f36', '#bed742', '#74905d'],
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
      formatter: (datum, data) => (datum ? `${datum.value} 台` : `${data.reduce((r, d) => r + d.value, 0)} 台`),
    },
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };
  return <Pie {...config} />;
};
export default Hostinfo;