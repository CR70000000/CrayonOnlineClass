import React, { useEffect, useState } from 'react'
import { Divider, Timeline, message } from 'antd'
import {
  BulbOutlined,
  ApiOutlined,
  FireOutlined,
  RocketOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.css'
import { fetchlearnpathList } from '@/store/modules/learnpath'
import { useDispatch, useSelector } from 'react-redux'

export default function Learnpath() {
  const dispath = useDispatch()
  const routeList = useSelector((state) => state.learnpath.learnpathList)

  // 组件挂载后，执行获取数据的操作
  useEffect(() => {
    dispath(fetchlearnpathList())
  }, [dispath])

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
      {/* 时间轴组件，展示学习路线 */}
      <div className='learnpath-container'>
        {routeList.map((item) => {
          return (
            <div className='learnpath' key={item.id}>
              <Divider />
              <div className='content'>
                <div className='left'>
                  {/* 使用Timeline展示学习路线的每个阶段 */}
                  <Link to={`/learnpath/detail/${item.id}`}>
                    <Timeline
                      items={item.children.map((child) => ({
                        key: child.id,
                        children: child.name + ':' + child.description,
                        color: item.color,
                      }))}
                    />
                  </Link>
                </div>
                <div className='right'>
                  {/* 路线简介及链接 */}
                  <Link
                    to={`/learnpath/detail/${item.id}`}
                    className={`class-list-item class-0${item.parent_route_id}`}
                  >
                    <h6>{item.name}</h6>
                    <p>{item.introduction}</p>
                    <div className='class-logo'>
                      <i>{item.parent_route_id}</i>
                      {/* 显示对应的图标 */}
                      {item.parent_route_id === 1 && <BulbOutlined />}
                      {item.parent_route_id === 2 && <ApiOutlined />}
                      {item.parent_route_id === 3 && <FireOutlined />}
                      {item.parent_route_id === 4 && <RocketOutlined />}
                      {item.parent_route_id === 5 && <SunOutlined />}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
