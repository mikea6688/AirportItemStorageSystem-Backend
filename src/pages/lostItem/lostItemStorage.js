import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, Typography, message } from 'antd';
import './lostItemStorage.css'; // 引入样式文件
import { addLostOrder } from '../../api';

const { Title } = Typography;

const LostItemStorage = () => {
  const [form] = Form.useForm();
  const [storagePerson, setStoragePerson] = useState('');
  const [storageType, setStorageType] = useState('');
  const [storageTime, setStorageTime] = useState('');
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('user');
    try {
      const user = JSON.parse(currentUser);
      setStoragePerson(user.accountName);
    } catch (error) {
      setStoragePerson('未知存储人');
      message.error("序列化失败")
    }
  }, []);

  // 提交表单
  const handleSubmit = () => {
    if (!storageType || !storageTime || !itemName) {
      message.error('请完整填写所有信息！');
      return;
    }
    setLoading(true);
    addLostOrder({
      sizeType: storageType,
      dateType: storageTime,
      name: itemName,
      isLostItem: true
    })
    .then((res) =>{
        if (res === 1) {
          message.info("提交成功！")
        }
        else{
          message.error("提交失败！")
        }
    })
    .catch((error) =>{
      message.error(error.response.data.message)
    });
    setLoading(false);
  };

  return (
    <div className="storage-container">
      <div className="storage-form-container">
        <Title level={3} className="storage-title">遗失物品存储</Title>

        <Form form={form} layout="vertical">
          <Form.Item label="请选择存储柜子类型" required>
            <Select
              value={storageType}
              onChange={setStorageType}
              className="storage-input"
            >
              <Select.Option value="Small">小</Select.Option>
              <Select.Option value="Medium">中</Select.Option>
              <Select.Option value="Large">大</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="请选择存储时间" required>
            <Select
              value={storageTime}
              onChange={setStorageTime}
              className="storage-input"
            >
              <Select.Option value="OneWeek">一个星期</Select.Option>
              <Select.Option value="OneMonth">一个月</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="物品名称" required>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="storage-input"
              placeholder="请输入物品名称"
            />
          </Form.Item>

          <Form.Item label="存储人" required>
            <Input
              value={storagePerson}
              disabled
              className="storage-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="storage-button"
            >
              确认存储
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LostItemStorage;
