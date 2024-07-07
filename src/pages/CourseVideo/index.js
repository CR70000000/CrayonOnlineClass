import React, { useEffect } from 'react'
import { Card, Menu } from 'antd'
import './index.css'
import dayjs from 'dayjs'
import CourseComments from '@/pages/CourseComments'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStaticUrl } from '@/utils/picUrl'
import { fetchAddRecord } from '@/store/modules/record'
import {
  fetchCourseCatalogListByCourseId,
  fetchCourseCatalogVideoListByCatalogId,
} from '@/store/modules/course'
import UserAuthorization from '@/components/UserAuthorization'


// 递归构造目录，保证每个key是唯一的
function constructMenu(chapters, prefix = '') {
  return chapters?.map((chapter) => {
    const key = `${prefix}${chapter.id}`
    if (chapter.children) {
      return {
        id: chapter.id,
        label: chapter.name,
        key: key,
        children: constructMenu(chapter.children, `${key}-`),
      }
    }
    return {
      id: chapter.id,
      label: chapter.name,
      key: key,
    }
  })
}

function CourseVideos() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const courseId = queryParams.get('courseId')

  // 用户信息
  const userInfo = useSelector((state) => state.user.userInfo)
  // 课程全部目录
  const catalogList = useSelector((state) => state.course.courseCatalogList)
  // 课程二级目录和视频
  const detail = useSelector((state) => state.course.courseCatalogVideoList)

  const items = constructMenu(catalogList)

  // 增加学习记录
  const addRecord = async () => {
    // 用户未登录
    if (!userInfo) return
    // 记录的信息
    const recordList = {
      user_id: userInfo.id,
      child_catalog_id: id,
      ctime: dayjs(new Date()).format('YYYY-MM-DD HH:mm'),
    }
    // 发送请求记录
    await dispatch(fetchAddRecord(recordList))
  }

  // 获取课程详情和评论
  const fetchData = async () => {
    // 根据课程ID获取课程目录
    await dispatch(fetchCourseCatalogListByCourseId(courseId))
    // 根据父级目录ID获取课程二级目录和视频
    await dispatch(fetchCourseCatalogVideoListByCatalogId(id))
  }

  useEffect(() => {
    fetchData()
    addRecord()
  }, [])

  // 点击目录跳转
  const handleClick = (e) => {
    navigate(`/course/video/${e.key.split('-').pop()}?courseId=${courseId}`)
    window.location.reload()
  }

  return (
    <div className='container'>
      {/* 目录名称 */}
      <div className='video-title-container'>
        <span className='video-title'>{detail?.name}</span>
      </div>
      <div className='video-main'>
        {/* 目录区域 */}
        <Card style={{ marginRight: 20, width: 300 }}>
          <Menu mode='inline' items={items} onClick={handleClick} />
        </Card>
        {/* 视频区域 */}
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <video width={850} src={getStaticUrl(detail?.video)} controls />
        </Card>
      </div>
      {/* 评论区域 */}
      <div className='comments-container'>
        <CourseComments courseId={courseId} id={id} />
      </div>
    </div>
  )
}

const CourseVideo = UserAuthorization(CourseVideos)

export default CourseVideo
