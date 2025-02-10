import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { addNotification, getAllNotification, updateNotification, deleteNotification, publishNotification, unpublishNotification } from '../../api';
import moment from 'moment';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState({ title: '', author: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [viewContentModalOpen, setViewContentModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = (params = {}) => {
    setLoading(true);
    getAllNotification({
      title: searchText.title,
      author: searchText.author,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        if (res && Array.isArray(res.notifications)) {
          setNotifications(res.notifications.map(notification => ({ ...notification, key: notification.id })));
          setPagination(prev => ({
            ...prev,
            total: res.total,
          }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error("获取公告数据失败");
      });
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchData({
      pageIndex: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 删除
  const handleDelete = (id) => {
    deleteNotification(id)
      .then(() => {
        fetchData();
        message.success('删除成功');
      })
      .catch((error) => {
        message.error('删除失败');
      });
  };

  // 发布
  const handlePublish = (key) => {
    publishNotification(key)
    .then(() => {
      fetchData();
      message.success('公告发布成功');
    })
    .catch((error) => {
      message.error('公告发布失败');
    })
  };

  // 取消发布
  const handleUnpublish = (key) => {
    unpublishNotification(key)
    .then(() => {
      fetchData();
      message.success('取消发布成功');
    })
    .catch((error) => {
      message.error('取消发布失败');
    })
  };

  const showModal = (record = null) => {
    setCurrentAnnouncement(record);
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  // 编辑和新增
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (currentAnnouncement) {
        const updateData = {
          id: currentAnnouncement.key,
          title: values.title,
          content: values.content,
        };
        updateNotification(updateData)
          .then(() => {
            message.success('公告更新成功');
            fetchData();
          })
          .catch((error) => {
            message.error('公告更新失败');
          });
      } else {
        const addData = {
          title: values.title,
          content: values.content,
        };
        addNotification(addData)
          .then(() => {
            message.success('公告新增成功');
            fetchData();
          })
          .catch((error) => {
            message.error('公告新增失败');
          });
      }
      setIsModalOpen(false);
    });
  };


  const handleViewContent = (content) => {
    setViewContentModalOpen(true);
    form.setFieldsValue({ content });
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: '15%',
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: '25%',
      render: (text) => (
        <Space>
          <span>{text.slice(0, 50)}</span>
          {text.length > 50 && (
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewContent(text)}
            >
              查看内容
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: '编写人',
      dataIndex: 'author',
      width: '15%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'), // 格式化时间到秒
    },
    {
      title: '操作',
      render: (record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            disabled={record.publish} // 已发布不可编辑
          >
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.key)}
            disabled={record.publish} // 已发布不可删除
          >
            删除
          </Button>
          {record.publish ? (
            <Button type="default" onClick={() => handleUnpublish(record.key)}>
              取消发布
            </Button>
          ) : (
            <Button type="primary" onClick={() => handlePublish(record.key)}>
              发布
            </Button>
          )}
        </Space>
      ),
      width: '20%',
    },
  ];
  

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          新增公告
        </Button>
        <Space>
          <Input
            placeholder="输入标题"
            value={searchText.title}
            onChange={(e) => setSearchText({ ...searchText, title: e.target.value })}
          />
          <Input
            placeholder="输入编写人"
            value={searchText.author}
            onChange={(e) => setSearchText({ ...searchText, author: e.target.value })}
          />
          <Button
            icon={<SearchOutlined />}
            type="primary"
            onClick={handleSearch}
          >
            查询
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={notifications}
        bordered
        pagination={pagination}
        loading={loading}
        onChange={(pagination) => setPagination({ ...pagination })}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={currentAnnouncement ? '编辑公告' : '新增公告'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入公告内容' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="查看公告内容"
        open={viewContentModalOpen}
        onCancel={() => setViewContentModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setViewContentModalOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="内容" name="content">
            <Input.TextArea rows={6} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notification;
