// 存储学习路线信息的状态
import { createSlice } from '@reduxjs/toolkit'
import { request } from '@/utils'

const recordStore = createSlice({
  name: 'record',
  initialState: {
    // 课程列表
    userCourseList: [],
    // 学习记录列表
    recordList: [],
  },
  reducers: {
    setUserCourseList(state, action) {
      state.userCourseList = action.payload
    },
    setRecordList(state, action) {
      state.recordList = action.payload
    },
  },
})

// 解构
const { setUserCourseList, setRecordList } = recordStore.actions

const recordReducer = recordStore.reducer

// 判断课程是否加入
const fetchCheckCourse = (courseid) => {
  return async (dispatch) => {
    const res = await request.get(`/record/course/check/${courseid}`)
    return res
  }
}

// 添加或移除课程
const fetchAddOrRemoveCourse = (courseid) => {
  return async (dispatch) => {
    const res = await request.get(`/record/course/addorremove/${courseid}`)
    return res
  }
}

// 增加学习记录
const fetchAddRecord = (recordList) => {
  return async (dispatch) => {
    const res = await request.post('/record/record/add', recordList)
    return res
  }
}

// 删除学习记录
const fetchDeleteRecord = (recordid) => {
  return async (dispatch) => {
    const res = await request.delete(`/record/record/delete/${recordid}`)
    return res
  }
}

// 获取用户的课程列表
const fetchUserCourseList = () => {
  return async (dispatch) => {
    const res = await request.get('/record/course/list')
    dispatch(setUserCourseList(res.data.data))
    return res
  }
}

// 获取用户的学习记录列表
const fetchUserRecordList = () => {
  return async (dispatch) => {
    const res = await request.get('/record/record/list')
    dispatch(setRecordList(res.data.data))
    return res
  }
}

export {
  fetchCheckCourse,
  fetchAddOrRemoveCourse,
  fetchAddRecord,
  fetchDeleteRecord,
  fetchUserCourseList,
  fetchUserRecordList,
}

export default recordReducer
