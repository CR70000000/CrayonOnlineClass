import React, { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, Input } from 'antd'
import { Link } from 'react-router-dom'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCourseCategoryList,
  fetchCourseList,
} from '@/store/modules/course'

const { Search } = Input

export default function Course() {
  const dispatch = useDispatch()
  // 课程列表
  const courseList = useSelector((state) => state.course.courseList)
  // 课程列表
  const [courseLists, setCourseLists] = useState({})
  // 课程分类
  const [categories, setCategories] = useState([])

  // 活跃的 Tab 键
  const [activeTabKey, setActiveTabKey] = useState('')
  // 搜索框中的文本
  const [searchText, setSearchText] = useState('')

  // 加载课程列表
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCourseList())
    }
    fetchData()
  }, [dispatch])

  // 使用 useMemo 确保 sortedData 只在 courseList 真的变化时重新计算
  const sortedData = useMemo(() => {
    const initialData = categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat.category_order]: [],
      }),
      {},
    )

    return courseList.reduce((acc, item) => {
      if (!acc[item.direction]) {
        acc[item.direction] = []
      }
      acc[item.direction].push(item)
      return acc
    }, initialData)
  }, [courseList, categories]) // 依赖于 courseList 和 categories

  useEffect(() => {
    async function fetchData() {
      const categoriesRes = await dispatch(fetchCourseCategoryList())
      if (categoriesRes.data.code === 200) {
        const categoryData = categoriesRes.data.data.map((cat) => ({
          key: cat.category_order,
          label: cat.category_name,
        }))

        setCategories(categoryData)

        const frontendCategory = categoryData.find((cat) => cat.key === '0')
        setActiveTabKey(
          frontendCategory ? frontendCategory.key : categoryData[0].key,
        )
      }
    }
    fetchData()
  }, [dispatch]) // 删除 courseList 依赖

  useEffect(() => {
    setCourseLists(sortedData)
  }, [sortedData]) // 只有当 sortedData 真的变化时才更新

  // 处理 Tab 切换
  const onTabChange = (key) => {
    setActiveTabKey(key)
  }

  // 处理搜索操作，更新搜索文本
  const onSearch = (value) => {
    setSearchText(value.toLowerCase())
  }

  // 渲染课程卡片的函数
  const renderCourseCard = (course) => (
    <Col key={course.id} span={6}>
      <Link to={`/course/detail/${course.id}`}>
        <Card
          className='card'
          hoverable
          cover={<img alt={course.category} src={course.pic} />}
        >
          <Card.Meta title={course.category} description={course.description} />
        </Card>
      </Link>
    </Col>
  )

  // 根据搜索结果过滤课程
  const filteredCourses = courseLists[activeTabKey]
    ? courseLists[activeTabKey].filter((course) =>
        course.category.toLowerCase().includes(searchText),
      )
    : []

  return (
    <div className='container'>
      <div className='swiper-container'>
        <div className='swiper-wrapper'>
          <div className='swiper-slide'>
            <div className='slide-common slide-one'>
              <h1>丰富的课程自由选择学习</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='course-category'>
        <Card
          style={{ width: '100%' }}
          title='课程选择'
          extra={
            <Search
              placeholder='输入想要搜索的课程'
              onSearch={onSearch}
              allowClear
              style={{ width: 200 }}
            />
          }
          tabList={categories}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
          tabProps={{ size: 'middle' }}
        >
          {filteredCourses.length > 0 ? (
            <Row gutter={[24, 24]}>{filteredCourses.map(renderCourseCard)}</Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h2>课程正在努力更新中！敬请期待</h2>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
