import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubLearnpathListById } from '@/store/modules/learnpath'

export default function LearnpathDetail() {
  const { id } = useParams()
  const dispath = useDispatch()
  const subLearnpathList = useSelector(
    (state) => state.learnpath.subLearnpathList,
  )
  const courseStudyRoadParent = useSelector(
    (state) => state.learnpath.courseStudyRoadParent,
  )

  useEffect(() => {
    dispath(fetchSubLearnpathListById(id))
  }, [id, dispath])

  return (
    <div className='container'>
      <div className='swiper-container'>
        <div className='swiper-wrapper'>
          <div className='swiper-slide'>
            <div className='slide-common slide-one'>
              <h1>系统的学习路线会让你少走很多的弯路</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='page-header'>
        <span className='page-header-title'>{courseStudyRoadParent.name}</span>
        <span className='page-header-desc'>
          {courseStudyRoadParent.introduction}
        </span>
      </div>
      <div className='class-content'>
        <ul className='class-wrap'>
          {subLearnpathList.map((path) => (
            <li key={path.id}>
              <div className='list-title'>
                <div className={`list-icon icon-${path.child_route_id}`}></div>
                <Link
                  to={`/learnpath/${path.id}`}
                  className={`list-name name-${path.child_route_id}`}
                >
                  {path.name}
                </Link>
              </div>
              <ul className={`list-info info-${path.child_route_id}`}>
                {path.courses.map((course) => (
                  <li className='info-item' key={course.id}>
                    <Link to={`/course/detail/${course.id}`}>
                      <span className='item-title'>{course.category}</span>
                      <p className='item-number'>{course.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
