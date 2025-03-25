import { createBrowserRouter, Navigate } from 'react-router-dom';
import Main from "../pages/main";
import User from '../pages/user';
import Notification from '../pages/notification';
import UserComment from '../pages/userComment';
import ItemList from '../pages/item/itemList';
import ItemConfigSetting from '../pages/item/itemConfigSetting';
import Statistical from "../pages/statistical";
import Order from '../pages/order';
import LoginPage from '../pages/login';
import LostItemList from '../pages/lostItem/lostItemList';
import LostItemStorage from '../pages/lostItem/lostItemStorage';
import Logistics from '../pages/logistics/inde';
import ItemCategory from '../pages/item/itemCategory';

// 保护路由组件
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    // 如果没有 token，则跳转到登录页
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const routes = [
    {
        path: '/login',
        Component: LoginPage,
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />, // 默认跳转到登录页
    },
    {
        path: '/',
        Component: Main,
        children: [
            {
                path: 'user',
                element: <ProtectedRoute><User /></ProtectedRoute>, // 需要登录才能访问
            },
            {
                path: 'order',
                element: <ProtectedRoute><Order /></ProtectedRoute>, // 需要登录才能访问
            },
            {
                path: 'userComment',
                element: <ProtectedRoute><UserComment /></ProtectedRoute>, // 需要登录才能访问
            },
            {
                path: 'statistical',
                element: <ProtectedRoute><Statistical /></ProtectedRoute>, // 需要登录才能访问
            },
            {
                path: 'notification',
                element: <ProtectedRoute><Notification /></ProtectedRoute>, // 需要登录才能访问
            },
            {
                path: 'item',
                children: [
                    {
                        path: 'list',
                        element: <ProtectedRoute><ItemList /></ProtectedRoute>, 
                    },
                    {
                        path: 'configSetting',
                        element: <ProtectedRoute><ItemConfigSetting /></ProtectedRoute>, 
                    },
                    {
                        path: 'category',
                        element: <ProtectedRoute><ItemCategory /></ProtectedRoute>
                    }
                ]
            },
            {
                path: 'lostItem',
                children: [
                    {
                        path: 'list',
                        element: <ProtectedRoute><LostItemList /></ProtectedRoute>, 
                    },
                    {
                        path: 'storage',
                        element: <ProtectedRoute><LostItemStorage /></ProtectedRoute>, 
                    }
                ]
            },
            {
                path: 'logistics',
                element: <ProtectedRoute><Logistics/></ProtectedRoute>
            }
        ]
    },
    // 如果找不到路径，则重定向到登录页
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    }
];

export default createBrowserRouter(routes);
