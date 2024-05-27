import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserCourseList } from '@/store/modules/record'

export default function UserCourse() {
  const dispatch = useDispatch()
  // 用户课程列表
  const userCourseList = useSelector((state) => state.record.userCourseList)

  // 获取用户课程列表
  useEffect(() => {
    async function fetchData() {
      dispatch(fetchUserCourseList())
    }
    fetchData()
  }, [dispatch])

  return (
    <div className='course-container'>
      {userCourseList.length > 0 ? (
        <ul>
          {userCourseList.map((item) => (
            <li className='item' key={item.id}>
              <Link to={`/course/detail/${item.id}`}>
                <div className='thumb'>
                  <img src={item?.pic} alt={item?.category || 'Course Image'} />
                </div>
                <div className='info'>
                  <div className='info-title'>{item?.category}</div>
                  <p>
                    <span>{item?.description}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <h3
          style={{
            margin: '20px',
          }}
        >
          您未添加任何课程，快去添加自己喜欢的课程吧！
        </h3>
      )}
    </div>
  )
}
