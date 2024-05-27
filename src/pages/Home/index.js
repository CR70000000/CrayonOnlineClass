import React, { useEffect, useState } from 'react'
import { Carousel, Col, Row, Card } from 'antd'
import './index.css'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchCourseList } from '@/store/modules/course'

import banner1 from '@/assets/banner1.jpg'
import banner2 from '@/assets/banner2.jpg'
import banner3 from '@/assets/banner3.jpg'
import banner4 from '@/assets/banner4.jpg'

export default function Home() {
  const dispatch = useDispatch()
  // 推荐课程列表
  const [courseList, setCourseList] = useState([])
  // 前端课程列表
  const [frontendList, setFrontendList] = useState([])
  // 后端课程列表
  const [javaList, setJavaList] = useState([])

  // 获取课程列表
  const fetchData = async () => {
    const res = await dispatch(fetchCourseList())
    // 设置推荐课程(取前5个)
    setCourseList(res.data.data.filter((i) => i.type === 1).slice(0, 5))
    // 设置前端和后端课程(分别取前4个)
    setFrontendList(res.data.data.filter((i) => i.direction === 0).slice(0, 4))
    setJavaList(res.data.data.filter((i) => i.direction === 1).slice(0, 4))
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])

  return (
    <div>
      {/* 轮播图区域 */}
      <div className='banner'>
        <Carousel autoplay>
          {[banner1, banner2, banner3, banner4].map((img, index) => (
            <div key={index}>
              <img
                className='banner-img'
                src={img}
                alt={`banner${index + 1}`}
              />
            </div>
          ))}
        </Carousel>
        <div className='banner-container'>
          {/* 轮播图旁的文字介绍 */}
          <div className='banner-left'>
            <h3 className='left-title'>蜡笔课堂在线学习</h3>
            <p className='left-intro'>0基础编程入行必备网站</p>
            <p className='left-info'>
              蜡笔课堂的前端知识体系庞大、内容精炼、轨迹清晰、通俗易懂,可能是在校学生,想转业的朋友学习编程的最佳途径！
            </p>
            {/* 概览信息列表 */}
            <div className='summary-list'>
              <div className='summary-item'>
                <div className='summary-logo summary-bg01'>
                  <i className='iconfont icon-tongjixinxiyufabu'></i>
                </div>
                课程系统化
              </div>
              <div className='summary-item'>
                <div className='summary-logo summary-bg02'>
                  <i className='iconfont icon-yijianfankui-'></i>
                </div>
                为零基础定制
              </div>
              <div className='summary-item'>
                <div className='summary-logo summary-bg03'>
                  <i className='iconfont icon-banjianpingjia'></i>
                </div>
                超2000+课时
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='section'>
        <div className='title'>
          <span className='text'>推荐课程</span>
        </div>
        <div className='course-row'>
          {courseList.map((item) => (
            <div className='course-item' key={item.id}>
              <Link to={`/course/detail/${item.id}`}>
                <Card
                  style={{ height: '100%' }}
                  className='card'
                  hoverable
                  cover={<img alt={item.description} src={item.pic} />}
                >
                  <Card.Meta
                    title={item.category}
                    description={item.description}
                  />
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* 分类课程展示 */}
      {renderCourseSection('前端课程', '以下是最新的前端课程', frontendList)}
      {renderCourseSection('后端课程', '以下是最新的后端课程', javaList)}
    </div>
  )
}

// 渲染课程分类部分的函数
function renderCourseSection(title, subtitle, courses) {
  // 当课程列表为空时，显示提示信息
  // TODO: 这里应该用一个组件来处理
  if (courses.length === 0) {
    return (
      <div className='section'>
        <div className='title'>
          <span className='text'>{title}</span>
        </div>
        <p>课程正在努力更新中！敬请期待！！！</p>
      </div>
    )
  }
  return (
    <div className='section'>
      <div className='title'>
        <span className='text'>{title}</span>
        <span className='text-en'>{subtitle}</span>
      </div>
      <Row gutter={16}>
        {courses.map((item) => (
          <Col span={6} key={item.id}>
            <Link to={`/course/detail/${item.id}`}>
              <Card
                style={{ height: '100%' }}
                className='card'
                hoverable
                cover={<img alt={item.category} src={item.pic} />}
              >
                <Card.Meta
                  title={item.category}
                  description={item.description}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}
