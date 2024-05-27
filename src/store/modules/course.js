// 存储课程信息的状态
import { createSlice } from '@reduxjs/toolkit'
import { request } from '@/utils'

const courseStore = createSlice({
  name: 'course',
  initialState: {
    // 课程列表
    courseList: [],
    // 课程分类列表
    courseCategoryList: [],
    // 课程详细列表
    courseDetail: [],
    // 课程目录列表(全部目录)
    courseCatalogList: [],
    // 课程二级目录和视频
    courseCatalogVideoList: [],
    // 课程评论列表
    courseCommentList: [],
  },
  reducers: {
    // 设置课程列表
    setCourseList(state, action) {
      state.courseList = action.payload
    },
    // 设置课程分类列表
    setCourseCategoryList(state, action) {
      state.courseCategoryList = action.payload
    },
    // 设置课程详细列表
    setCourseDetail(state, action) {
      state.courseDetail = action.payload
    },
    // 设置课程目录列表
    setCourseCatalogList(state, action) {
      state.courseCatalogList = action.payload
    },
    // 设置课程二级目录和视频
    setCourseCatalogVideoList(state, action) {
      state.courseCatalogVideoList = action.payload
    },
    // 设置课程评论列表
    setCourseCommentList(state, action) {
      state.courseCommentList = action.payload
    },
  },
})

// 解构
const {
  setCourseList,
  setCourseCategoryList,
  setCourseDetail,
  setCourseCatalogList,
  setCourseCatalogVideoList,
  setCourseCommentList,
} = courseStore.actions

const courseReducer = courseStore.reducer

// 获取全部课程列表
const fetchCourseList = () => {
  return async (dispath) => {
    const res = await request.get('/api/courses/list')
    dispath(setCourseList(res.data.data))
    return res
  }
}

// 获取课程分类列表
const fetchCourseCategoryList = () => {
  return async (dispath) => {
    const res = await request.get('/api/courses/category')
    dispath(setCourseCategoryList(res.data.data))
    return res
  }
}

// 根据ID获取课程详细
const fetchCourseDetailById = (id) => {
  return async (dispath) => {
    const res = await request.get(`/api/courses/detail/${id}`)
    dispath(setCourseDetail(res.data.data))
    return res
  }
}

// 根据课程ID获取课程目录列表
const fetchCourseCatalogListByCourseId = (courseid) => {
  return async (dispath) => {
    const res = await request.get(`/course/catalog/list/${courseid}`)
    dispath(setCourseCatalogList(res.data.data))
    return res
  }
}

// 根据父目录ID获取子目录信息和视频
const fetchCourseCatalogVideoListByCatalogId = (catalogid) => {
  return async (dispath) => {
    const res = await request.get(`/course/catalog/child/${catalogid}`)
    dispath(setCourseCatalogVideoList(res.data.data))
    return res
  }
}

// 根据课程ID获取课程评论列表
const fetchCourseCommentListByCourseId = (courseid) => {
  return async (dispatch) => {
    const res = await request.get(`/comment/list/${courseid}`)
    if (res.data.code !== 200) {
      return
    }
    // 对评论按时间进行降序排序
    const sortedComments = res.data.data.sort(
      (a, b) => new Date(b.ctime) - new Date(a.ctime),
    )
    dispatch(setCourseCommentList(sortedComments))
    return res
  }
}

// 添加课程评论
const fetchAddComment = (comment) => {
  return async (dispath) => {
    const res = await request.post('/comment/add', comment)
    return res
  }
}

// 根据用户ID删除课程评论
const fetchDeleteComment = (commentid) => {
  return async (dispath) => {
    const res = await request.delete(`/comment/delete/${commentid}`)
    return res
  }
}

// 根据课程ID删除课程信息
const fetchDeleteCourseByCourseId = (courseid) => {
  return async (dispath) => {
    const res = await request.delete(`/course/delete/${courseid}`)
    return res
  }
}

// 添加课程
const fetchAddCourse = (course) => {
  return async (dispath) => {
    const res = await request.post('/course/add', course)
    return res
  }
}

// 更新课程信息
const fetchUpdateCourse = (course) => {
  return async (dispath) => {
    const res = await request.post('/course/update', course)
    return res
  }
}

// 根据课程分类ID删除课程分类
const fetchDeleteCourseCategoryById = (categoryid) => {
  return async (dispath) => {
    const res = await request.delete(`/course/category/${categoryid}`)
    return res
  }
}

// 根据课程分类ID更新课程分类
const fetchUpdateCourseCategoryById = (categoryid, category) => {
  return async (dispath) => {
    const res = await request.patch(`/course/category/update/${categoryid}`, category)
    return res
  }
}

export {
  fetchCourseList,
  fetchCourseCategoryList,
  fetchCourseDetailById,
  fetchCourseCatalogListByCourseId,
  fetchCourseCatalogVideoListByCatalogId,
  fetchCourseCommentListByCourseId,
  fetchAddComment,
  fetchDeleteComment,
  fetchDeleteCourseByCourseId,
  fetchAddCourse,
  fetchUpdateCourse,
  fetchDeleteCourseCategoryById,
  fetchUpdateCourseCategoryById,
}

export default courseReducer
