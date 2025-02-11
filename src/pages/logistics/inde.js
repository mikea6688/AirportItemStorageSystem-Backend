import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getOrderLogisticsList, operateUserLogisticsOrder } from '../../api';

const Logistics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState({ storedBy: '', cabinetId: '' });

    // 分页参数
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    // 状态映射表
    const statusMap = {
        Pending: { text: "待处理", color: "orange" },
        InTransit: { text: "配送中", color: "blue" },
        Arrived: { text: "已送达", color: "green" },
        Discarded: { text: "已废弃", color: "red" },
    };

    const fetchData = () => {
        setLoading(true);
        getOrderLogisticsList({
            cabinetNumber: searchText.cabinetNumber,
            userAccount: searchText.storageUserAccount,
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
        })
            .then((res) => {
                console.log("后端返回数据:", res);
                if (res && Array.isArray(res.logisticsInfo)) {
                    setData(res.logisticsInfo.map(x => ({ ...x, key: x.id })));
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
                message.error("获取物流数据失败");
            });
    };

    // 查询功能
    const handleSearch = () => {
        const filteredData = data.filter(item =>
            (searchText.storageUserAccount ? item.userAccount.includes(searchText.storageUserAccount) : true) &&
            (searchText.cabinetNumber ? item.cabinetNumber.includes(searchText.cabinetNumber) : true)
        );
        setData(filteredData);
    };

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    // 操作物流订单
    const handleOrder = (data) => {
        setLoading(true);
        operateUserLogisticsOrder({
            id: data.id,
            operateType: data.operateType
        })
        .then((res)=>{
            if(res === 1){
                message.success('操作成功！')
                fetchData();
            }
            else{
                message.error('操作失败！')
            }
        })
        .catch((error) =>{
            message.error(error.response.data.message)
        })
        .finally(() => {
            setLoading(false);
        });
    };

    // 表格列配置
    const columns = [
        {
            title: '柜子编号',
            dataIndex: 'storageCabinetNumber',
        },
        {
            title: '存储人账号',
            dataIndex: 'storageUserAccount',
        },
        {
            title: '收件人',
            dataIndex: 'recipient',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '收货地址',
            dataIndex: 'deliveryAddress',
        },
        {
            title: '物流状态',
            dataIndex: 'logisticsStatus',
            render: (status) => {
                const statusInfo = statusMap[status] || { text: "未知状态", color: "gray" };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            }
        },
        {
            title: '操作',
            render: (record) => (
                <Space>
                    <Button
                        disabled={record.logisticsStatus != 'Pending'}
                        onClick={() => handleOrder({
                            id: record.id,
                            operateType: 'Delivery' 
                        })}
                    >
                        确认寄出
                    </Button>
                    <Button
                        disabled={record.logisticsStatus != 'InTransit'}
                        type="primary"
                        onClick={() => handleOrder({
                            id: record.id,
                            operateType: 'Arrival' 
                        })}
                    >
                        确认送到
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
                        placeholder="输入存储人账号"
                        value={searchText.storageUserAccount}
                        onChange={(e) => setSearchText({ ...searchText, storageUserAccount: e.target.value })}
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
}

export default Logistics;