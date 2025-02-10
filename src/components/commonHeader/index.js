import React from "react";
import { Button, Avatar, Layout, Dropdown, message } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { Header } = Layout;

const CommonHeader = () => {
    const navigate = useNavigate(); 

    const logout = () => {
        localStorage.removeItem("token");
        
        message.success("退出成功");

        navigate("/login");
    }

    const items = [
        {
            key: '1',
            label: (
                <a onClick={logout} target="_blank" rel="noopener noreferrer">
                    退出
                </a>
            )
        }
    ];

    return (
        <Header className="header-container">
            <Dropdown menu={{ items }}>
                <Avatar
                    size={42}
                    className="header-avatar"
                    src={<img src={require("../../assets/images/user.png")} alt="user" />}
                />
            </Dropdown>
        </Header>
    );
}

export default CommonHeader;
