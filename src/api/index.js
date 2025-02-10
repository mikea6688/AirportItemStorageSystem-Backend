import http from './axios'

const getUserId = () => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
        const user = JSON.parse(storedUserData);
        return user.id
    }
};

//#region 用户相关api
export const getAllUserData = ({ pageIndex, pageSize, nickName, accountName }) => {
    return http.get('/user/all', {
            pageIndex,
            pageSize,
            nickName: nickName || null,  // 如果没有传递值，默认为 null
            accountName: accountName || null,  // 同样，默认为 null
    }, 
    {
        headers: {
            'userId': getUserId(), // 将 userId 加入请求头
        },
    });
};

export const deleteUser = (data) =>{
    return http.post('/user/delete', data)
}

export const updateUser = (data) =>{
    return http.post('/user/update', data);
};

export const loginUser = (data) =>{
    return http.post('/user/login', data)
}

export const registerUser = (data) =>{
    return http.post('/user/register', data)
}
//#endregion

//#region 用户评论api
export const getAllUserCommentData = ({ pageIndex, pageSize, id, accountName }) => {
    return http.get('/user/comment/list', {
            pageIndex,
            pageSize,
            id: id || null, 
            accountName: accountName || null, 
    });
};

export const deleteUserComment = (data) =>{
    return http.post('/user/comment/delete', data)
}
//#endregion

//#region 公告api

export const addNotification = (data) =>{
    return http.post('/notification/add', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const updateNotification = (data) =>{
    return http.post('/notification/update', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const deleteNotification = (data) =>{
    return http.post('/notification/delete', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const publishNotification = (data) =>{
    return http.post('/notification/publish', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const unpublishNotification = (data) =>{
    return http.post('/notification/unpublish', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const getAllNotification = (data) =>{
    return http.get('/notification/list', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

//#endregion

//#region 柜子api

export const addCabinet = (data) =>{
    return http.post('/storage/add', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const updateCabinet = (data) =>{
    return http.post('/storage/update', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const deleteCabinet = (data) =>{
    return http.post('/storage/delete', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const getCabinets = (data) =>{
    return http.get('/storage/list', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const getCabinetsSeeting = () =>{
    return http.get('/storage/setting/get', {},
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

export const updateCabinetsSeeting = (data) =>{
    return http.post('/storage/setting/update', data,
        {
            headers: {
                'userId': getUserId()
            }
        }
    )
}

//#endregion

//#region 订单api

export const getAllOrder = (data) => {
    return http.get('/order/all', data, {
        headers: {
            'userId': getUserId()
        }
    }
    )
}

export const getOrderLogisticsList = (data) => {
    return http.get('/order/logistics/all', data, {
        headers: {
            'userId': getUserId()
        }
    })
}

export const addLostOrder = (data) => {
    return http.post('/order/add', data, {
        headers: {
            'userId': getUserId()
        }
    })
}

export const getAllLostOrder = (data) =>{
    return http.get('/order/lost/all', data, {
        headers: {
            'userId': getUserId()
        }
    })
}

//#endregion

//#region 统计api

export const getOrderStatistical = (data) =>{
    return http.get('/order/statistical', data,{
        headers: {
            'userId': getUserId()
        }
    })
}

//#endregion
