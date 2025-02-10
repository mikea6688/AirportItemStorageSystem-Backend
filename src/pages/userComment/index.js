import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message, Modal, Form } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllUserCommentData, deleteUserComment } from '../../api';

const UserComment = () => {
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState({ feedbackId: '', userAccount: '' });

  const [pagination, setPagination] = useState({
    current: 1,    // 当前页
    pageSize: 10,  // 每页显示条数
    total: 0,      // 总记录数
  });

  // 获取用户数据，处理分页和查询
  const fetchData = (params = {}) => {
    setLoading(true);
    getAllUserCommentData({
      accountName: searchText.userAccount,
      id: searchText.feedbackId,    
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        console.log("后端返回数据:", res);
        if (res && Array.isArray(res.userComments)) {
          setUserComments(res.userComments.map(comment => ({ ...comment, key: comment.id }))); // 确保 `key` 存在
          setPagination(prev => ({
            ...prev,
            total: res.total, // 总记录数
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

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]); 

  // 处理查询
  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchData({
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 删除操作
  const handleDelete = (key) => {
    deleteUserComment(key)
      .then(() => {
        setUserComments(userComments.filter((item) => item.key !== key));
        message.success("删除成功");
      })
      .catch((error) => {
          console.error(error);
          message.error("删除失败");
      });
  };

  // 表格列配置
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '用户账户',
      dataIndex: 'accountName',
    },
    {
      title: '内容',
      dataIndex: 'comment',
      ellipsis: true, // 自动省略过长的文本
    },
    {
      title: '评论时间',
      dataIndex: 'commentDate',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '操作',
      render: (record) => (
        <Space>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* 顶部操作区 */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        {/* 查询 */}
        <Space>
          <Input
            placeholder="输入编号"
            value={searchText.feedbackId}
            onChange={(e) => setSearchText({ ...searchText, feedbackId: e.target.value })}
          />
          <Input
            placeholder="输入用户账户"
            value={searchText.userAccount}
            onChange={(e) => setSearchText({ ...searchText, userAccount: e.target.value })}
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

      {/* 表格展示反馈信息 */}
      <Table columns={columns} dataSource={userComments} bordered />
    </div>
  );
};

export default UserComment;
