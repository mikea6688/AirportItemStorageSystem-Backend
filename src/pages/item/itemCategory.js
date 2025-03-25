import React, { useState, useEffect } from "react";
import moment from 'moment';
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Badge, Button, Modal, Form, Input, Select, Popconfirm, message, Space } from "antd";
import { addStorageCategory, deleteStorageCategory, getAllStorageCategories, updateStorageCategory } from "../../api";

const ItemCategory = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        {
          id:"",
          name:"",
          createdDate:"",
        }
      ]);

    const [editingCategory, setEditingCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // 分页信息
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    //  加载数据
    const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const res = await getAllStorageCategories({
                pageIndex: page,
                pageSize: pageSize,
            });

            if (res && Array.isArray(res.storageCategories)) {
                setData(res.storageCategories.map(category => ({ ...category, key: category.id, name: category.categoryName })));
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: res.total,
                }));
            }
        } catch (error) {
            message.error("获取数据失败");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [pagination.current]);

    //  新增 or 编辑弹窗
    const showModal = (category = null) => {
        console.log("🔵 showModal 被调用，数据：", category);
        setEditingCategory(category);
        setIsModalOpen(true);

        if (category) {
            form.setFieldsValue({
                name: category.categoryName,
                id: category.id,
            });
        } else {
            form.resetFields();
        }
    };

    // 新增或编辑数据
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            console.log("🔵 提交数据：", values);

            if (editingCategory) {
                const updateData = {
                    id: editingCategory.id,
                    name: values.name,
                };

                try {
                    const res = await updateStorageCategory(updateData);
                    if (res === 1) {
                        message.success('柜子信息更新成功');
                    } else {
                        message.error('柜子信息更新失败');
                    }
                } catch (error) {
                    message.error('柜子信息更新失败');
                }

            } else {
                console.log("🔵 新增数据：", values);
                const addData = {
                    name: values.name
                };

                try {
                    const res = await addStorageCategory(addData);
                    if (res === 1) {
                        message.success("新增柜子成功！");
                    } else {
                        message.error("新增柜子失败！");
                    }
                } catch (error) {
                    message.error("新增操作失败");
                }
            }
        } catch (error) {
            message.error("请完整填写所有信息");
        } finally {
            loadData(1, pagination.pageSize); // Load data after success
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    // 删除柜子
    const handleDelete = async (id) => {
        try {
            await deleteStorageCategory(id);
            message.success("删除成功");
            loadData(1, pagination.pageSize); // 重新加载数据
        } catch {
            message.error("删除失败");
        }
    };

    //  处理分页
    const handleTableChange = (pagination) => {
        loadData(pagination.current, pagination.pageSize);
    };

    const columns = [
        { title: "编号", dataIndex: "id", key: "id" },
        { title: "类别名称", dataIndex: "name", key: "name" },
        {
            title: '创建时间',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => showModal(record)}
                        disabled={record.stored}
                    >
                        编辑
                    </Button>
                    <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    新增存储类别
                </Button>
            </div>

            {/* 柜子信息表格 */}
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />

            {/* 弹窗 */}
            <Modal title={editingCategory ? "编辑" : "新增"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="类别名称" rules={[{ required: true, message: "请输入类别名称" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ItemCategory;