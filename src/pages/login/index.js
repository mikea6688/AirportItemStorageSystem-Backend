import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import './loginPage.css';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    setLoading(true);
    loginUser(values)
      .then((response) => {
        const userData = response.user; 
        const token = response.token; 

        localStorage.setItem("token", token); 
        localStorage.setItem("user", JSON.stringify(userData));

        // axios.defaults.headers['X-User-Id'] = userData.id;

        message.success("登录成功");
        navigate("/user");
      })
      .catch((error) => {
        message.error(error.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Row className="login-page">
      <Col xs={24} sm={12} md={8} lg={6}>
        <div className="login-form-container">
          <h2>后台登录</h2>
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="login-btn"
            >
              登录
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
