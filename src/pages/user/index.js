import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Form, message, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllUserData, updateUser, deleteUser } from "../../api";  // 你需要实现这些 API 方法

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState({ account: "", name: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();

    // 分页参数
    const [pagination, setPagination] = useState({
        current: 1,    // 当前页
        pageSize: 10,  // 每页显示条数
        total: 0,      // 总记录数
    });

    // 获取用户数据，处理分页和查询
    const fetchData = (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        getAllUserData({
            accountName: searchText.account,  // 获取查询条件
            nickName: searchText.name,        // 获取查询条件
            pageIndex: page,     // 获取当前页
            pageSize: pageSize,  // 获取每页条数
        })
        .then((res) => {
            if (res && Array.isArray(res.users)) {
                setUsers(res.users.map(user => ({ ...user, key: user.id }))); // 确保 `key` 存在
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: res.total
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

    // 初次加载数据
    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);  // 依赖分页变化

    // 处理查询
    const handleSearch = () => {
        setPagination((prev) => ({
            ...prev,
            current: 1,
        }));
        // 执行查询
        fetchData({
            page: 1,        
            pageSize: pagination.pageSize,
        });
    };

    // 打开/关闭编辑或新增弹窗
    const showModal = (record = null) => {
        setCurrentUser(record);
        setIsModalOpen(true);
        if (record) {
            form.setFieldsValue(record);
        } else {
            form.resetFields();
        }
    };

    // 删除
    const handleDelete = (key) => {
        deleteUser(key)
            .then(() => {
                setUsers(users.filter((user) => user.key !== key));
                message.success("删除成功");
            })
            .catch((error) => {
                console.error(error);
                message.error("删除失败");
            });
    };

    // 更新
    const handleOk = () => {
        form.validateFields().then((values) => {
            if (currentUser) {
                const userData = {
                    userId: currentUser.key,
                    accountName: values.accountName,
                    nickName: values.nickName,
                    role: values.role,
                    phone: values.phone,
                    email: values.email,
                    address: values.address
                }
                // 编辑
                updateUser(userData)
                .then(() => {
                    setUsers(users.map((user) => (user.key === currentUser.key ? { ...user, ...values } : user)));
                    message.success("用户更新成功");
                    setIsModalOpen(false);
                })
                .catch((error) => {
                    console.error(error);
                    message.error("更新失败");
                });
            }
        });
    };

    // 分页
    const handleTableChange = (pagination) => {
        fetchData(pagination.current, pagination.pageSize);
    };

    const roleTypeMap = {
        Ordinary: '普通用户',
        VIP: 'VIP 用户',
        Admin: '管理员'
    };

    const columns = [
        {
            title: "账号",
            dataIndex: "accountName"
        },
        {
            title: "姓名",
            dataIndex: "nickName",
        },
        {
            title: "角色",
            dataIndex: "roleType",
            render: (roleType) => roleTypeMap[roleType] || roleType, // 根据 roleType 显示角色名称
        },
        {
            title: "手机号",
            dataIndex: "phone",
        },
        {
            title: "邮箱",
            dataIndex: "email",
        },
        {
            title: "地址",
            dataIndex: "address"
        },
        {
            title: "账户余额",
            dataIndex: "point",
            render: (point) => `￥${point}`,
        },
        {
            title: "存储次数",
            dataIndex: "storageCount"
        },
        {
            title: "是否存储",
            dataIndex: "isStored",
            render: (isStored) => (isStored ? "是" : "否"),
        },
        {
            title: "操作",
            render: (record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>编辑</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)}>删除</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                {/* <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增</Button> */}
                <Space>
                    <Input
                        placeholder="输入账号"
                        value={searchText.account}
                        onChange={(e) => setSearchText({ ...searchText, account: e.target.value })}
                    />
                    <Input
                        placeholder="输入姓名"
                        value={searchText.name}
                        onChange={(e) => setSearchText({ ...searchText, name: e.target.value })}
                    />
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>查询</Button>
                </Space>
            </Space>

            <Table
                columns={columns}
                dataSource={users}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal
                title="编辑用户"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="账号" name="accountName" >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="姓名" name="nickName" rules={[{ required: true, message: "请输入姓名" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="角色" name="roleType" rules={[{ required: true, message: "请选择角色" }]}>
                        <Select disabled >
                            <Select.Option value="Ordinary">普通用户</Select.Option>
                            <Select.Option value="VIP">VIP 用户</Select.Option>
                            <Select.Option value="Admin">管理员</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="手机号" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="邮箱" name="email">
                        <Input />
                    </Form.Item>
                    <Form.Item label="地址" name="address">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default User;
