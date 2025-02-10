import { Outlet } from 'react-router-dom'
import React from 'react';
import CommonAside from '../components/commonAside';
import CommonHeader from '../components/commonHeader';
import { Layout, theme } from 'antd';

const { Content } = Layout;

const Main = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout className="main-container">
            <CommonAside />
            <Layout>
                <CommonHeader />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Main;
