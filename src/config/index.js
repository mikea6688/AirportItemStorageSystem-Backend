export default [
    {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'UserOutlined',
        url: '/user/index'
    },
    {
        path: '/order',
        name: 'order',
        label: '订单管理',
        icon: 'SolutionOutlined',
        url: '/order/index'
    },
    {
        path: '/logistics',
        name: 'logistics',
        label: '快递物流管理',
        icon: 'TruckOutlined',
        url: '/logistics/index'
    },
    {
        path: '/lostItem',
        label: '遗失物品管理',
        icon: 'InboxOutlined',
        children:[
            {
                path: '/lostItem/list',
                name: 'list',
                label: '物品信息',
                icon: 'AppstoreOutlined',
            },
            {
                path: '/lostItem/storage',
                name: 'storage',
                label: '物品存储',
                icon: 'AppstoreOutlined',
            }
        ]
    },
    {
        path: '/item',
        label: '存储柜管理',
        icon: 'AppstoreOutlined',
        children:[
            {
                path: '/item/list',
                name: 'list',
                label: '列表信息',
                icon: 'AppstoreOutlined',
            },
            {
                path: '/item/configSetting',
                name: 'configSetting',
                label: '配置设置',
                icon: 'AppstoreOutlined',
            }
        ]
    },
    {
        path: '/statistical',
        name: 'statistical',
        label: '存储统计图',
        icon: 'LineChartOutlined',
        url: '/statistical/index'
    },
    {
        path: '/userComment',
        name: 'userComment',
        label: '用户意见反馈',
        icon: 'MessageOutlined',
        url: '/userComment/index'
    },
    {
        path: '/notification',
        name: 'notification',
        label: '公告管理',
        icon: 'MutedOutlined',
        url: '/notification/index'
    }
]