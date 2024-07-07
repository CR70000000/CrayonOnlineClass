import { request } from '@/utils'

// 获取全部课程列表
export const courseListAPI = () => {
  return request({
    url: '/api/courses/list',
    method: 'get',
  })
}

// 获取课程分类列表
export const courseCategoryListAPI = () => {
  return request({
    url: '/api/courses/category',
    method: 'get',
  })
}

// 根据ID获取课程详细
export const courseDetailByIdAPI = (id) => {
  return request({
    url: `/api/courses/detail/${id}`,
    method: 'get',
  })
}

// 根据课程ID获取课程目录列表
export const courseCatalogListByCourseIdAPI = (courseid) => {
  return request({
    url: `/course/catalog/list/${courseid}`,
    method: 'get',
  })
}

// 根据父目录ID获取子目录信息和视频
export const courseCatalogVideoListByCatalogIdAPI = (catalogid) => {
  return request({
    url: `/course/catalog/child/${catalogid}`,
    method: 'get',
  })
}

// 根据课程ID获取课程评论列表
export const courseCommentListByCourseIdAPI = (courseid) => {
  return request({
    url: `/comment/list/${courseid}`,
    method: 'get',
  })
}

// 添加课程评论
export const addCommentAPI = (comment) => {
  return request({
    url: '/comment/add',
    method: 'post',
    data: comment,
  })
}

// 根据用户ID删除课程评论
export const deleteCommentAPI = (commentid) => {
  return request({
    url: `/comment/delete/${commentid}`,
    method: 'delete',
  })
}

// 根据课程ID删除课程信息
export const deleteCourseByCourseIdAPI = (courseid) => {
  return request({
    url: `/course/delete/${courseid}`,
    method: 'delete',
  })
}

// 添加课程
export const addCourseAPI = (course) => {
  return request({
    url: '/course/add',
    method: 'post',
    data: course,
  })
}

// 更新课程信息
export const updateCourseAPI = (course) => {
  return request({
    url: '/course/update',
    method: 'post',
    data: course,
  })
}

// 根据课程分类ID删除课程分类
export const deleteCourseCategoryByIdAPI = (categoryid) => {
  return request({
    url: `/course/category/${categoryid}`,
    method: 'delete',
  })
}

// 根据课程分类ID更新课程分类
export const updateCourseCategoryByIdAPI = (categoryid, category) => {
  return request({
    url: `/course/category/update/${categoryid}`,
    method: 'patch',
    data: category,
  })
}
