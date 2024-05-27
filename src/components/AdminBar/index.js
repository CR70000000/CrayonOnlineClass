import { React, useState } from 'react'
import { Col, Row, Avatar } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import classNames from 'classnames'

import Logo from '@/assets/Logo.png'

const navList = [
  { id: 8, name: '首页', path: '/' },
  { id: 9, name: '课程', path: '/course' },
  { id: 10, name: '学习路线', path: '/learnpath' },
  { id: 1, name: '用户管理', path: '/admin/user' },
  { id: 2, name: '课程管理', path: '/admin/course' },
  { id: 3, name: '分类管理', path: '/admin/coursecategory' },
  { id: 4, name: '路线管理', path: '/admin/learnpath' },
  { id: 5, name: '子路线管理', path: '/admin/child-path' },
  { id: 6, name: '目录管理', path: '/admin/catalog' },
  { id: 7, name: '子目录管理', path: '/admin/child-catalog' },
]

export default function NavBar() {
  // 导航栏当前激活的标签
  const [activeTab, setActiveTab] = useState()
  // 用户信息状态
  const [userInfo] = useState(JSON.parse(localStorage.getItem('userInfo')))

  // 处理导航标签的激活状态变更
  const changeActiveTab = (id) => setActiveTab(id)

  return (
    <>
      <div
        className='nav'
        style={{
          width: '100%',
          marginBottom: '20px',
        }}
      >
        <Row>
          <Col span={2}>
            <Link to='/admin/user'>
              <div className='logo'>
                <img src={Logo} alt='' />
                蜡笔课堂
              </div>
            </Link>
          </Col>
          <Col span={18}>
            <ul className='menu'>
              {navList.map((item) => (
                <li key={item.id} className='menu-item'>
                  <Link
                    to={item.path}
                    className={
                      activeTab === item.id
                        ? 'router-link-active router-link-exact-active'
                        : ''
                    }
                    onClick={() => changeActiveTab(item.id)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col span={4}>
            <ul className='menu'>
              <li className='menu-item'>
                <Link
                  to='/user'
                  className={classNames('user-profile', {
                    'router-link-active router-link-exact-active':
                      activeTab === 0,
                  })}
                  onClick={() => changeActiveTab(0)}
                >
                  <Avatar size={32} src={userInfo.avatar} />
                  <span className='user-name'>{userInfo.username}</span>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <Outlet />
    </>
  )
}
