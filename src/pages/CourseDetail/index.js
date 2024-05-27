import { React, useEffect, useState } from 'react'
import { Card, Button, message, Popconfirm } from 'antd'
import './index.css'
import DetailIntroduction from './DetailIntroduction/index'
import DetailCatalogue from './DetailCatalogue/index'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseDetailById } from '@/store/modules/course'
import {
  fetchAddOrRemoveCourse,
  fetchCheckCourse,
} from '@/store/modules/record'

const tabListNoTitle = [
  { key: 'introduction', label: '课程简介' },
  { key: 'catalogue', label: '课程目录' },
]

export default function CourseDetail() {
  const dispatch = useDispatch()
  const { id } = useParams()
  // 导航标签状态
  const [activeTabKey, setActiveTabKey] = useState('introduction')
  // 课程是否加入
  const [isStudy, setIsStudy] = useState(true)
  // 从redux中获取课程详细信息
  const courseDetailState = useSelector((state) => state.course.courseDetail)
  const courseCatalogList = useSelector(
    (state) => state.course.courseCatalogList,
  )
  // 课程详细信息
  const [courseDetail, setCourseDetail] = useState(courseDetailState || {})
  // 课程目录信息
  const [catalogList, setCatalogList] = useState(courseCatalogList || [])
  // 用户详细信息
  const userInfo = useSelector((state) => state.user.userInfo)

  const fetchData = async () => {
    // 请求课程详细信息和目录
    const res = await dispatch(fetchCourseDetailById(id))
    if (res.data.code === 200) {
      // 请求课程详细信息
      setCourseDetail(res.data.data.course)
      // 请求课程目录
      setCatalogList(res.data.data.parentCatalogs)
    } else {
      message.error(res.data.message)
    }
  }

  // 请求课程是否加入
  const checkCourse = async () => {
    if (!userInfo.id) {
      return
    }
    const res = await dispatch(fetchCheckCourse(id))
    if (res.data.code === 200) {
      setIsStudy(!res.data.data)
    } else {
      message.error(res.data.err)
    }
  }

  useEffect(() => {
    fetchData()
    checkCourse()
  }, [dispatch, id])

  // 添加或移除课程的通用方法
  const toggleCourse = async () => {
    if (!userInfo.id) {
      message.warning('登录后才可以加入课程哦')
      return
    }
    const res = await dispatch(fetchAddOrRemoveCourse(id))
    if (res.data.code === 200) {
      message.success(res.data.message)
      setIsStudy(!isStudy)
    } else {
      message.error(res.data.err)
    }
  }

  // 课程简介和目录的内容
  const contentListNoTitle = {
    introduction: <DetailIntroduction data={courseDetail} />,
    catalogue: (
      <DetailCatalogue
        data={catalogList}
        userInfo={userInfo}
        isStudy={isStudy}
      />
    ),
  }

  return (
    <div className='container'>
      <div className='course-title-container'>
        <div className='title-content'>
          <span className='course-title'>{courseDetail.category}</span>
          {isStudy ? (
            <Button type='primary' onClick={toggleCourse}>
              加入课程
            </Button>
          ) : (
            <Popconfirm
              title='您确定要移除当前课程吗?'
              onConfirm={toggleCourse}
              okText='移除'
              cancelText='取消'
            >
              <Button danger>移除课程</Button>
            </Popconfirm>
          )}
        </div>
      </div>
      <div className='main'>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
          tabProps={{ size: 'middle' }}
        >
          {contentListNoTitle[activeTabKey]}
        </Card>
      </div>
    </div>
  )
}
