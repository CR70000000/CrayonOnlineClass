// 组合redux子模块 + 导出store实例
import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './modules/modal'
import userReducer from './modules/user'
import courseReducer from './modules/course'
import learnpathReducer from './modules/learnpath'
import recordReducer from './modules/record'

const store = configureStore({
  reducer: {
    // 模态框
    modal: modalReducer,
    // 用户
    user: userReducer,
    // 课程
    course: courseReducer,
    // 学习路径
    learnpath: learnpathReducer,
    // 学习记录
    record: recordReducer
  },
})

export default store