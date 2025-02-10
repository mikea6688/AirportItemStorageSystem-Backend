import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAllOrder } from '../../api';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const Order = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState({ storedBy: '', cabinetId: '' });

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,   
    pageSize: 15, 
    total: 0,      
  });

  const fetchData = (params = {}) => {
    setLoading(true);
    getAllOrder({
      cabinetNumber: searchText.cabinetNumber,  
      username: searchText.username,      
      pageIndex: pagination.current,     
      pageSize: pagination.pageSize,  
    })
    .then((res) => {
      console.log("后端返回数据:", res); 
      if (res && Array.isArray(res.orders)) {
        setData(res.orders.map(x => ({ ...x, key: x.id })));
        setPagination(prev => ({
          ...prev,
          total: res.total,
        }));
      } else {
        console.error("返回数据格式不正确:", res);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("获取数据失败:", error);
      setLoading(false);
      message.error("获取用户数据失败");
    });
  };

  // 查询功能
  const handleSearch = () => {
    const filteredData = data.filter(item =>
      (searchText.storedBy ? item.storedBy.includes(searchText.storedBy) : true) &&
      (searchText.cabinetId ? item.cabinetId.includes(searchText.cabinetId) : true)
    );
    setData(filteredData);
  };

  useEffect(() => {
          fetchData();
      }, [pagination.current, pagination.pageSize]);

  // 丢弃操作
  const handleDiscard = (key) => {
    setData(data.filter(item => item.key !== key));
    message.success('已丢弃');
  };

  // 表格列配置
  const columns = [
    {
      title: '柜子编号',
      dataIndex: 'num',
    },
    {
      title: '存储人名称',
      dataIndex: 'username',
    },
    {
      title: '存储时间',
      dataIndex: 'storageDate',
    },
    {
      title: '已存时间',
      dataIndex: 'storedDuration',
      render: (seconds) => {
        const d = dayjs.duration(seconds, "seconds");
        return `${d.days()}天 ${d.hours()}小时 ${d.minutes()}分钟`;
      }
    },
    {
      title: '存储凭证',
      dataIndex: 'voucherNumber',
    },
    {
      title: '花费',
      dataIndex: 'storagePrice',
    },
    {
      title: '是否付款',
      dataIndex: 'isPayment',
      render: (text) => (text === false ? "否" : "是")
    },
    {
      title: '操作',
      render: (record) => (
        <Space>
          <Button
            danger
            onClick={() => handleDiscard(record.key)}
          >
            丢弃
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* 顶部操作区 */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        {/* 右侧：查询 */}
        <Space>
          <Input
            placeholder="输入存储人名称"
            value={searchText.username}
            onChange={(e) => setSearchText({ ...searchText, username: e.target.value })}
          />
          <Input
            placeholder="输入柜子编号"
            value={searchText.cabinetNumber}
            onChange={(e) => setSearchText({ ...searchText, cabinetNumber: e.target.value })}
          />
          <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </Space>

      {/* 表格展示柜子信息 */}
      <Table columns={columns} dataSource={data} loading={loading} bordered />
    </div>
  );
};

export default Order;
