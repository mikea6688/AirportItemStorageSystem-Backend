import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message, Form, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getCabinetsSeeting, updateCabinetsSeeting } from '../../api';

const { Column } = Table;

const ItemConfigSetting = () => {
  const [data, setData] = useState();
  const [searchParams, setSearchParams] = useState({
    num: '',
    size: '',
  });
  const formatDateType = (dateType) => {
    switch (dateType) {
      case 'ThreeDays': return '三天';
      case 'OneWeek': return '一周';
      case 'OneMonth': return '一个月';
      default: return dateType;
    }
  };

  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm(); // Form 实例
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制弹窗显示与否
  const [currentRecord, setCurrentRecord] = useState(null); // 当前编辑的数据
  const [loading, setLoading] = useState(false); // 加载状态

   //  加载数据
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getCabinetsSeeting();
        if (res && Array.isArray(res.settingList)) {
          setData(res.settingList.map(setting => ({ ...setting, 
            key: setting.id,
            size: `${setting.length}x${setting.width}x${setting.height}cm`,
            dateType: formatDateType(setting.dateType)
           })));
        }
      } catch (error) {
        message.error("获取数据失败");
      }
      setLoading(false);
    };

      useEffect(() => {
        loadData();
      }, []);


  // 编辑价格弹窗
  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({ price: record.price });
    setIsModalVisible(true);
  };

  // 保存编辑的价格
  const handleSave = async () => {
    setLoading(true);
    try {
      await form.validateFields().then((values) =>{
        const res = updateCabinetsSeeting({
          id: currentRecord.key,
          price: values.price,
        })
        .then((res) => {
          if (res === 1) {
            loadData(); // 重新加载数据
            message.success('价格更新成功');
          } else {
            message.error('价格更新失败');
          }
        });
      });

      setIsModalVisible(false); // 关闭弹窗

      setLoading(false);
    } catch (err) {
      console.log('保存失败：', err);
      setLoading(false);
    }
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* 表格展示部分 */}
      <Table
        bordered
        dataSource={data}
        rowClassName="editable-row"
        pagination={false}
        rowKey="key"
      >
        <Column title="柜子配置编号" dataIndex="id" />
        <Column title="柜子规模" dataIndex="size" />
        <Column title="存储时间规则" dataIndex="dateType" />
        <Column title="单价" dataIndex="price" />

        {/* 操作列：编辑价格 */}
        <Column
          title="操作"
          render={(text, record) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)} // 点击编辑按钮，打开弹窗
              >
                编辑
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* 编辑价格弹窗 */}
      <Modal
        title="编辑价格"
        visible={isModalVisible}
        onOk={handleSave} 
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="价格"
            name="price"
            initialValue={currentRecord?.price}
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemConfigSetting;
