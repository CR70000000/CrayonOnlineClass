import React from 'react'
import { Routes, Route } from 'react-router-dom'

import NavBar from '@/components/NavBar'
import AdminBar from '@/components/AdminBar'

import Home from '@/pages/Home'
import Course from '@/pages/Course'
import CourseDetail from '@/pages/CourseDetail'
import CourseVideo from '@/pages/CourseVideo'
import User from '@/pages/User'
import Learnpath from '@/pages/Learnpath'
import LearnpathDetail from '@/pages/LearnpathDetail'

import AdminCourse from '@/pages/AdminCourse'
import AdminLearn from '@/pages/AdminLearn'
import AdminUsers from '@/pages/AdminUsers'
import AdminChild from '@/pages/AdminChildLearn'
import AdminChildCatalog from '@/pages/AdminChildCatalog'
import AdminCatalog from '@/pages/AdminCatalog'
import AdminCourseCategory from '@/pages/AdminCourseCategory'

// 底部
import FootWrap from '@/components/FootWrap'

import NotFound from '@/components/NotFound'

import { useSelector } from 'react-redux'

export default function Router() {
  const type = useSelector((state) => state.user?.userInfo)?.type

  return (
    <>
      <Routes>
        <Route element={type === 0 || !type ? <NavBar /> : <AdminBar />}>
          {/* 首页 */}
          <Route path='/' element={<Home />} />
          {/* 用户页 */}
          <Route path='/user' element={<User />} />
          {/* 课程首页 */}
          <Route path='/course' element={<Course />} />
          {/* 课程视频页 */}
          <Route path='/course/video/:id' element={<CourseVideo />} />
          {/* 课程详细页 */}
          <Route path='/course/detail/:id' element={<CourseDetail />} />
          {/* 学习路线首页 */}
          <Route path='/learnpath' element={<Learnpath />} />
          {/* 学习路线详细页 */}
          <Route path='/learnpath/detail/:id' element={<LearnpathDetail />} />

          {/* 课程管理 */}
          <Route path='/admin/course' element={<AdminCourse />} />
          {/* 课程分类管理 */}
          <Route
            path='/admin/coursecategory'
            element={<AdminCourseCategory />}
          />
          {/* 用户管理 */}
          <Route path='/admin/user' element={<AdminUsers />} />
          {/* 学习路线父节点 */}
          <Route path='/admin/learnpath' element={<AdminLearn />} />
          {/* 学习路线子节点 */}
          <Route path='/admin/child-path' element={<AdminChild />} />
          {/* 课程目录父章节 */}
          <Route path='/admin/catalog' element={<AdminCatalog />} />
          {/* 课程目录子章节 */}
          <Route path='/admin/child-catalog' element={<AdminChildCatalog />} />
        </Route>
        {/* 404页 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <FootWrap />
    </>
  )
}
