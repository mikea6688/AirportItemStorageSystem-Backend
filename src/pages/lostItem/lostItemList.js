import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Button, Space, Select, message, Modal, Form } from 'antd';
import { DeleteOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getAllLostOrder, deleteLostItemOrder, operateUserOrder } from '../../api';

const { Option } = Select;

const LostItemList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState({ lostItemName: '', sizeType: '' });
  const [loading, setLoading] = useState(false);

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,   
    pageSize: 15, 
    total: 0,      
  });

  const fetchData = (params = {}) => {
    setLoading(true);
    getAllLostOrder({
      sizeType: searchParams.sizeType,  
      lostItemName: searchParams.lostItemName,      
      pageIndex: pagination.current,     
      pageSize: pagination.pageSize,  
    })
    .then((res) => {
      console.log("后端返回数据:", res); 
      if (res && Array.isArray(res.orderLostItems)) {
        setData(res.orderLostItems.map(x => ({ ...x, key: x.id })));
        setPagination(prev => ({
          ...prev,
          total: res.total,
        }));
      } else {
        setData([]);
        console.log("返回数据格式:", res);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("获取数据失败:", error);
      setLoading(false);
      message.error("获取用户数据失败");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 查询操作
  const handleSearch = () => {
    fetchData();
  };

  // 删除操作
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确定删除此物品存储记录吗？',
      onOk: () => {
        deleteLostItemOrder(id)
        .then((res =>{
          if(res === 1){
            message.success('删除成功!');
            setData(data.filter(item => item.orderId !== id));
          }
          else{
            message.error('删除失败！')
          }
        }))
        .catch((error) =>{
          message.error('提交删除异常，请稍后再试')
        })
      }
    });
  };

  const handleTakeOut = (orderId) => {
    Modal.confirm({
      title: '确定取走遗失物品吗？',
      onOk: () => {
        operateUserOrder({
            orderId: orderId,
            operateType: 'TakeOut',
            isLostItemOrder: true
        })
        .then((res) =>{
          message.success('成功取走！');
          fetchData()
        })
        .catch((error) => {
          message.error("提取失败！")
        })
      }
    });
  };

  const statusMap = {
    Using: { text: "储存中", color: "blue" },
    TakenOut: { text: "已取出", color: "green" },
    Discarded: { text: "已废弃", color: "red" },
    SentForExpressDelivery: { text: "已寄件", color: "orange" },
  };

  // 表格列定义
  const columns = [
    {
      title: '柜子编号',
      dataIndex: 'cabinetNumber',
      key: 'cabinetNumber',
    },
    {
      title: '柜子类型',
      dataIndex: 'sizeType',
      key: 'sizeType',
      render: (text) => (text === 'Small' ? '小' : text === 'Medium' ? '中' : '大'),
    },
    {
      title: '物品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '存放时间',
      dataIndex: 'storageTime',
      key: 'storageTime',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '到期时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '存储人',
      dataIndex: 'storageName',
      key: 'storageName',
    },
    {
      title: '状态',
      dataIndex: 'storageStatus',
      key: 'storageStatus',
      render: (status) => {
        const statusInfo = statusMap[status] || { text: "未知状态", color: "gray" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            disabled={record.storageStatus != 'Using'}
            icon= {<SendOutlined />}
            onClick={() => handleTakeOut(record.orderId)}
          >
            取出
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.orderId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="lost-item-form-container">
      <div className="search-container">
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="物品名称"
              value={searchParams.lostItemName}
              onChange={(e) => setSearchParams({ ...searchParams, lostItemName: e.target.value })}
              style={{ width: 200 }}
            />
            <Select
              placeholder="选择柜子类型"
              value={searchParams.sizeType}
              onChange={(value) => setSearchParams({ ...searchParams, sizeType: value })}
              style={{ width: 160 }}
            >
              <Option value="">所有类型</Option>
              <Option value="Small">小</Option>
              <Option value="Medium">中</Option>
              <Option value="Large">大</Option>
            </Select>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              onClick={handleSearch}
            >
              查询
            </Button>
          </Space>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        bordered
        loading={loading}
        rowKey="key"
      />
    </div>
  );
};

export default LostItemList;
