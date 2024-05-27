// 存储学习路线信息的状态
import { createSlice } from '@reduxjs/toolkit'
import { request } from '@/utils'

const learnpathStore = createSlice({
  name: 'learnpath',
  initialState: {
    // 全部路线数据
    learnpathList: [],
    // 对应一级路线的二级路线数据
    subLearnpathList: [],
    // 全部二级路线数据
    subLearnpathListAll: [],
    // 一级路线信息
    courseStudyRoadParent:{},
  },
  reducers: {
    setLearnpathList(state, action) {
      state.learnpathList = action.payload
    },
    setSubLearnpathList(state, action) {
      state.subLearnpathList = action.payload
    },
    setSubLearnpathListAll(state, action) {
      state.subLearnpathListAll = action.payload
    },
    setCourseStudyRoadParent(state, action) {
      state.courseStudyRoadParent = action.payload
    }
  },
})

// 解构
const { setLearnpathList, setSubLearnpathList, setSubLearnpathListAll, setCourseStudyRoadParent } = learnpathStore.actions

const learnpathReducer = learnpathStore.reducer

// 获取全部学习路线
const fetchlearnpathList = () => {
  return async (dispath) => {
    const res = await request.get('/api/learnpath/list')
    dispath(setLearnpathList(res.data.data))
    return res
  }
}

// 根据id获取二级路线数据
const fetchSubLearnpathListById = (id) => {
  return async (dispath) => {
    const res = await request.get(`/api/learnpath/sublist/${id}`)
    dispath(setSubLearnpathList(res.data.data))
    dispath(setCourseStudyRoadParent(res.data.parentRoute))
    console.log(res)
    return res
  }
}

// 获取全部二级路线数据
const fetchSubLearnpathChildListAll = () => {
  return async (dispath) => {
    const res = await request.get('/learnpath/child/list')
    dispath(setSubLearnpathListAll(res.data.data))
    return res
  }
}

export { fetchlearnpathList, fetchSubLearnpathListById, fetchSubLearnpathChildListAll }

export default learnpathReducer
