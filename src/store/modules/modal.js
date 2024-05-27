// 存储登录注册模态框的状态
import { createSlice } from '@reduxjs/toolkit'

const modalStore = createSlice({
  name: 'modal',
  initialState: {
    // 将字符串 "true" 转换为布尔 true，其他任何值（包括未定义、null、"false"）都转换为布尔 false
    // 登录注册模态框状态 false: 关闭, true: 打开
    isModalOpen: localStorage.getItem('isModalOpen') === 'true',
    // 登录状态 false: 已登录, true: 未登录
    isLoginOpen: localStorage.getItem('isLoginOpen') !== 'false', // 默认为 true，除非明确存储了 "false"
  },
  reducers: {
    // 设置模态框状态
    setIsModalOpen(state, action) {
      state.isModalOpen = action.payload
      localStorage.setItem('isModalOpen', action.payload)
    },
    // 设置登录状态
    setIsLoginOpen(state, action) {
      state.isLoginOpen = action.payload
      localStorage.setItem('isLoginOpen', action.payload)
    },
    // 清除状态
    clearState(state) {
      state.isModalOpen = false
      state.isLoginOpen = true
      localStorage.removeItem('isModalOpen')
      localStorage.removeItem('isLoginOpen')
    },
  },
})

// 解构
const { setIsModalOpen, setIsLoginOpen, clearState } = modalStore.actions

const modalReducer = modalStore.reducer

export { setIsModalOpen, setIsLoginOpen, clearState }

export default modalReducer
