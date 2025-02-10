import axios from 'axios';

// axios 二次封装
class HttpRequest {
    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:8080/api', // 统一的 baseURL
            timeout: 500000 // 超时时间调整为 5s
        });

        this.interception(); // 绑定拦截器
    }

    interception() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            config => {
                // 可以在这里添加 token
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => {
                console.error("请求错误：", error);
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            response => {
                // 处理后端返回的数据（可选）
                return response.data;
            },
            error => {
                // 统一错误处理
                if (error.response) {
                    // 服务器返回错误
                    console.error(`HTTP 错误 ${error.response.status}:`, error.response.data);
                } else if (error.request) {
                    // 请求超时或无响应
                    console.error("无响应，请检查网络！");
                } else {
                    console.error("请求发生错误:", error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    get(url, params = {}, config = {}) {
        return this.instance.get(url, { params, ...config });
    }

    post(url, data = {}, config = {}) {
        return this.instance.post(url, data, {
            ...config,
            headers: {
                'Content-Type': 'application/json',
                'Source_System': "Backstage", // 后台系统
                ...config.headers
            }
        });
    }

    put(url, data = {}, config = {}) {
        return this.instance.put(url, data, { ...config });
    }

    delete(url, params = {}, config = {}) {
        return this.instance.delete(url, { params, ...config });
    }
}

// 直接导出实例
export default new HttpRequest();
