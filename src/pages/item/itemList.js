import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Form, Input, Select, Popconfirm, message, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { getCabinets, addCabinet, updateCabinet, deleteCabinet } from "../../api";

const { Option } = Select;

const ItemList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      num:"",
      name:"",
      sizeType:"",
    }
  ]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortSize, setSortSize] = useState(null);
  const [sortStored, setSortStored] = useState(null);

  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  //  加载数据
  const loadData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await getCabinets({
        name: searchText,
        sortBySize: sortSize,
        sortByStored: sortStored,
        pageIndex: page,
        pageSize: pageSize,
      });

      if (res && Array.isArray(res.cabinets)) {
        setData(res.cabinets.map(cabinet => ({ ...cabinet, key: cabinet.id })));
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
  }, [searchText, sortSize, sortStored, pagination.current]);

  //  处理分页
  const handleTableChange = (pagination) => {
    loadData(pagination.current, pagination.pageSize);
  };

  //  新增 or 编辑弹窗
  const showModal = (cabinet = null) => {
    console.log("🔵 showModal 被调用，数据：", cabinet);
    setEditingCabinet(cabinet);
    setIsModalOpen(true);

    if (cabinet) {
      form.setFieldsValue({
        name: cabinet.name,
        size: cabinet.sizeType === "Small" ? "小" : cabinet.sizeType === "Medium" ? "中" : "大",
        num: cabinet.num,
      });
    } else {
      form.resetFields();
    }
  };

  // 新增或编辑数据
  const handleOk = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      console.log("🔵 提交数据：", values);
      try {
        if (editingCabinet) {
          const updateData = {
            id: editingCabinet.id,
            name: values.name,
            num: values.num,
            sizeType: values.size,
          };
          updateCabinet(updateData)
          .then((res) => {
            if(res === 1)
              message.success('柜子信息更新成功');
            else
              message.error('柜子信息更新失败');
          })
          .catch((error) => {
            message.error('柜子信息更新失败');
          });
        } else {
          console.log("🔵 新增数据：", values);
          const addData = {
            name: values.name,
            num: values.num,
            sizeType: values.size,
          }
          console.log("🔵 新增数据：", addData);
          addCabinet(addData).then((res)=>{
            if(res === 1){
              message.success("新增柜子成功！");
            }
            else{
              message.error("新增柜子失败！")
            }
          });
        }
      } catch {
        message.error("操作失败");
      }
      loadData(); // 重新加载数据
      setIsModalOpen(false);
    }).catch((error) => {
      message.error("请完整填写所有信息");
    });
  };

  //  处理排序
  const handleSortChange = (field) => {
    if (field === "size") {
      setSortSize((prev) => (prev === "asc" ? "desc" : "asc"));
      setSortStored(null);
    } else if (field === "stored") {
      setSortStored((prev) => (prev === "asc" ? "desc" : "asc"));
      setSortSize(null);
    }
    setPagination((prev) => ({ ...prev, current: 1 })); //  变更排序时，重置到第一页
  };

  // 删除柜子
  const handleDelete = async (id) => {
    try {
      await deleteCabinet(id);
      message.success("删除成功");
      loadData(1, pagination.pageSize); // 重新加载数据
    } catch {
      message.error("删除失败");
    }
  };

  //查询
  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    loadData( 1, pagination.pageSize);
  };

  //  表格列配置
  const columns = [
    { title: "编号", dataIndex: "num", key: "num"},
    { title: "柜子名称", dataIndex: "name", key: "name"},
    {
      title: (
        <Button type="link" onClick={() => handleSortChange("size")}>
          柜子规模 {sortSize === "asc" ? "🔼" : "🔽"}
        </Button>
      ),
      dataIndex: "sizeType",
      render: (text) => (text === "Small" ? "小" : text === "Medium" ? "中" : "大"),
    },
    {
      title: (
        <Button type="link" onClick={() => handleSortChange("stored")}>
          是否存储 {sortStored === "asc" ? "🔼" : "🔽"}
        </Button>
      ),
      dataIndex: "stored",
      render: (text) => (
        <Badge status={text ? "success" : "error"} text={text ? "已存储" : "空闲中"} />
      )
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
          新增柜子
        </Button>

        <Space>
          {/* 搜索框 */}
          <Input
            placeholder="按名称查询..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination((prev) => ({ ...prev, current: 1 }));
              loadData(1, pagination.pageSize);
            }}
            style={{ width: "200px", }}
          />
          <Button
            icon={<SearchOutlined />}
            type="primary"
            onClick={handleSearch}
          >
            查询
          </Button>
        </Space>

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
      <Modal title={editingCabinet ? "编辑柜子" : "新增柜子"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="num" label="柜子编号" rules={[{ required: true, message: "请输入柜子编号"  }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="柜子名称" rules={[{ required: true, message: "请输入柜子名称" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="size" label="柜子规模" rules={[{ required: true, message: "请输入柜子规模" }]}>
            <Select>
              <Select.Option value='Small'>小</Select.Option>
              <Select.Option value="Medium">中</Select.Option>
              <Select.Option value="Large">大</Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ItemList;
