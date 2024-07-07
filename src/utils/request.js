// axios的封装处理
import axios from 'axios'
import { getToken } from './token'
import { message } from 'antd'

const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

// 添加请求拦截器
// 在请求发送之前 做拦截 插入一些自定义的配置 [参数的处理]
request.interceptors.request.use(
  (config) => {
    // 操作这个config 注入token数据
    // 1. 获取到token
    // 2. 按照后端的格式要求做token拼接
    const token = getToken()
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 添加响应拦截器
// 在响应返回到客户端之前 做拦截 重点处理返回的数据
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // 网络错误或服务器无响应
      message.error('服务器无响应. 稍后再试.')
    } else {
      // 根据不同的状态码进行处理
      switch (error.response.status) {
        case 500:
          message.error('服务器无响应. 稍后再试.')
          break
        case 401:
          message.error('未登录. 请重新登录.')
          // 可以重定向到登录页面
          break
        // 更多错误处理
        default:
          message.error('错误.')
      }
    }
    return Promise.reject(error)
  },
)

export { request }