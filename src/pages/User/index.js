import { React, useState } from 'react'
import { Avatar, Menu } from 'antd'
import './index.css'
import UserCourse from './UserCourse'
import UserRecord from './UserRecord'
import { useSelector } from 'react-redux'
import UserInfo from './UserInfo'
import UserAuthorization from '@/components/UserAuthorization'
function getItem(label, key) {
  return {
    key,
    label,
  }
}

const items = [
  getItem('我的课程', 'course'),
  getItem('学习记录', 'record'),
  getItem('个人信息', 'info'),
]

const contentList = {
  course: <UserCourse />,
  record: <UserRecord />,
  info: <UserInfo />,
}

function Users() {
  // 获取用户信息
  const userInfo = useSelector((state) => state.user.userInfo)
  const [activeTab, setActiveTab] = useState('course')

  // 更换导航栏
  const onClick = (e) => {
    setActiveTab(e.key)
  }

  return (
    <div className='container'>
      {/* 个人信息 */}
      <div className='user-info-container'>
        <div className='user-info'>
          <div className='left'>
            <div className='avatar'>
              <Avatar size={64} src={userInfo.avatar} />
            </div>
            <div className='text'>
              <div>{userInfo.username}</div>
              <div className='sub-text'>
                <div>
                  <span>尊贵的用户，畅快学习吧</span>
                </div>
              </div>
            </div>
          </div>
          <div className='right'>
            <p>日拱一卒无有尽，功不唐捐终入海</p>
            <p>坚持每日精进，加油！</p>
          </div>
        </div>
      </div>
      {/* 个人信息主体部分 */}
      <div className='main'>
        {/* 左边导航栏 */}
        <div className='left'>
          <Menu
            onClick={onClick}
            mode='inline'
            items={items}
            selectedKeys={activeTab}
          />
        </div>
        {/* 右边显示信息 */}
        <div className='right'>{contentList[activeTab]}</div>
      </div>
    </div>
  )
}

const User = UserAuthorization(Users)

export default User
