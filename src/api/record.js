import { request } from '@/utils'

// 判断课程是否加入
export const checkCourseAPI = (courseid) => {
  return request({
    url: `/record/course/check/${courseid}`,
    method: 'get',
  })
}

// 添加或移除课程
export const addOrRemoveCourseAPI = (courseid) => {
  return request({
    url: `/record/course/addorremove/${courseid}`,
    method: 'get',
  })
}

// 增加学习记录
export const addRecordAPI = (recordList) => {
  return request({
    url: '/record/record/add',
    method: 'post',
    data: recordList,
  })
}

// 删除学习记录
export const deleteRecordAPI = (recordid) => {
  return request({
    url: `/record/record/delete/${recordid}`,
    method: 'delete',
  })
}

// 获取用户的课程列表
export const userCourseListAPI = () => {
  return request({
    url: '/record/course/list',
    method: 'get',
  })
}

// 获取用户的学习记录列表
export const userRecordListAPI = () => {
  return request({
    url: '/record/record/list',
    method: 'get',
  })
}
