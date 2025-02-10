import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { getOrderStatistical } from '../../api';

const { RangePicker } = DatePicker;

const Statistical = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const endDate = dayjs(); 
    const startDate = endDate.subtract(1, 'month');
    setDateRange([startDate, endDate]); 
    handleSearch(startDate, endDate);
  }, []);

  const generateData = (startDate, endDate) => {
    const startDateStr = startDate.format('YYYY-MM-DDTHH:mm:ss');
    const endDateStr = endDate.format('YYYY-MM-DDTHH:mm:ss');
    let data;
  
    getOrderStatistical({
      StartTime: startDateStr,
      EndTime: endDateStr
    })
    .then((res) => {
      if (res && Array.isArray(res.data)) {
        data = res.data.map(x => ({
          ...x, 
          date: dayjs(x.date).format('YYYY-MM-DD'),
          usageCount: x.usageCount
        }));
        setData(data);
      }
    })
    .catch((error) => {
      console.log(error)
      message.error("查询失败！");
    });
    return data;
  };
  
  // 查询数据函数
  const handleSearch = (startDate, endDate) => {
    if (!startDate || !endDate) {
      message.error('请选择时间范围！');
      return;
    }
    setLoading(true);
    const fetchedData = generateData(startDate, endDate);
    setData(fetchedData);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          format="YYYY-MM-DD"
        />
        <Button
          type="primary"
          onClick={() => handleSearch(dateRange[0], dateRange[1])}
          loading={loading}
        >
          查询
        </Button>
      </Space>

      <div style={{ marginTop: 20, height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="usageCount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistical;
