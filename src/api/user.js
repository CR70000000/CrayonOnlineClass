import { request } from '@/utils'

// 登录
export const loginAPI = (loginForm) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: loginForm,
  })
}

// 注册
export const registerAPI = (registerForm) => {
  return request({
    url: '/api/register',
    method: 'post',
    data: registerForm,
  })
}

// 获取用户信息
export const userInfoAPI = () => {
  return request({
    url: '/users/myinfo',
    method: 'get',
  })
}

// 修改用户信息
export const updateUserInfoAPI = (userInfo) => {
  return request({
    url: '/users/myinfo',
    method: 'patch',
    data: userInfo,
  })
}

// 获取全部用户列表
export const getAllUserAPI = () => {
  return request({
    url: '/users/list',
    method: 'get',
  })
}

// 更改用户信息
export const updateUserAPI = (userid, userInfo) => {
  return request({
    url: `/users/update/${userid}`,
    method: 'post',
    data: userInfo,
  })
}

// 添加用户
export const addUserAPI = (userInfo) => {
  return request({
    url: '/users/add',
    method: 'post',
    data: userInfo,
  })
}

// 删除用户
export const deleteUserAPI = (userid) => {
  return request({
    url: `/users/del/${userid}`,
    method: 'delete',
  })
}
