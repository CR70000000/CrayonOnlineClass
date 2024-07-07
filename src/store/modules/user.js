// 存储登录注册模态框的状态
import { createSlice } from '@reduxjs/toolkit'
import { setToken as _setToken, getToken, removeToken } from '@/utils'
import {
  addUserAPI,
  deleteUserAPI,
  getAllUserAPI,
  loginAPI,
  registerAPI,
  updateUserAPI,
  updateUserInfoAPI,
  userInfoAPI,
} from '@/api/user'

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: getToken() || '', // token
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}, // 用户信息
  },
  reducers: {
    // 设置token
    setToken(state, action) {
      state.token = action.payload
      _setToken(action.payload)
    },
    // 设置用户信息
    setUserInfo(state, action) {
      state.userInfo = action.payload
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    // 退出登录清除信息
    clearUserInfo(state) {
      state.userInfo = {}
      localStorage.removeItem('userInfo')
      removeToken()
    },
  },
})

// 解构
const { setUserInfo, setToken, clearUserInfo } = userStore.actions

const userReducer = userStore.reducer

// 登录
const fetchLogin = (loginForm) => {
  return async (dispath) => {
    const res = await loginAPI(loginForm)
    dispath(setToken(res.data.token))
    return res
  }
}

// 注册
const fetchRegister = (registerForm) => {
  return async () => {
    const res = await registerAPI(registerForm)
    return res
  }
}

// 获取用户信息
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await userInfoAPI()
    dispatch(setUserInfo(res.data.user))
    return res
  }
}

// 修改用户信息
const fetchUpdateUserInfo = (userInfo) => {
  return async (dispatch) => {
    const res = await updateUserInfoAPI(userInfo)
    dispatch(setUserInfo(res.data.userInfo))
    return res
  }
}

// 获取全部用户列表
const fetchGetAllUser = () => {
  return async () => {
    const res = await getAllUserAPI()
    return res
  }
}

// 更改用户信息
const fetchUpdateUser = (userid, userInfo) => {
  return async () => {
    const res = await updateUserAPI(userid, userInfo)
    return res
  }
}

// 添加用户
const fetchAddUser = (userInfo) => {
  return async () => {
    const res = await addUserAPI(userInfo)
    return res
  }
}

// 删除用户
const fetchDeleteUser = (userid) => {
  return async () => {
    const res = await deleteUserAPI(userid)
    return res
  }
}

export {
  fetchLogin,
  fetchRegister,
  fetchUserInfo,
  fetchUpdateUserInfo,
  fetchGetAllUser,
  fetchUpdateUser,
  fetchAddUser,
  fetchDeleteUser,
  setToken,
  setUserInfo,
  clearUserInfo,
}

export default userReducer
