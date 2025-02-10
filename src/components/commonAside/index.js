import React from "react";
import MenuConfig from '../../config'
import * as Icon from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import {useNavigate} from 'react-router-dom'

const { Sider } = Layout;

// 动态获取icon
const iconToElement = (name) => React.createElement(Icon[name])

// 处理菜单的数据
const items = MenuConfig.map((icon) => {
    const child = {
        key: icon.path,
        icon: iconToElement(icon.icon),
        label: icon.label
    }
    // 有子菜单
    if (icon.children) {
        child.children = icon.children.map(item => {
            return {
                key: item.path,
                label: item.label
            }
        })
    }
    return child
})

const CommonAside = () => {
    const navigate = useNavigate()
    
    //点击菜单
    const selectMenu = (e) =>{
        navigate(e.key)
    }

    return (
        <Sider trigger={null} collapsible>
            <h3 className='app-name'>物品暂存后台系统</h3>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={items}
                style={{
                    height: '100%'
                }}
                onClick={selectMenu}
            />
        </Sider>
    )
}

export default CommonAside

