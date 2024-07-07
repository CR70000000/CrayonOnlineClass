import { React, useState } from 'react'
import { Col, Row, Modal, Avatar, message, Card } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setIsModalOpen, setIsLoginOpen } from '@/store/modules/modal'
import { fetchLogin, fetchRegister, fetchUserInfo } from '@/store/modules/user'

import Login from '@/components/Login'
import Register from '@/components/Register'
import Logo from '@/assets/Logo.png'
import './index.css'
import classNames from 'classnames'

// 定义导航列表
const navList = [
  { id: 1, name: '首页', path: '/' },
  { id: 2, name: '课程', path: '/course' },
  { id: 3, name: '学习路线', path: '/learnpath' },
]

// 登录和注册选项卡列表
const tabList = [
  { key: 'login', tab: '登录' },
  { key: 'register', tab: '注册' },
]

export default function NavBar() {
  const dispatch = useDispatch()
  const isModalOpen = useSelector((state) => state.modal.isModalOpen)
  const isLoginOpen = useSelector((state) => state.modal.isLoginOpen)

  const userInfo = useSelector((state) => state.user.userInfo)

  const [activeTab, setActiveTab] = useState()
  const [activeTabKey, setActiveTabKey] = useState('login')

  // 切换导航条的活动状态
  const changeActiveTab = (id) => setActiveTab(id)

  // 打开或关闭登录注册模态框
  const openModal = () => dispatch(setIsModalOpen(true))
  const closeModal = () => dispatch(setIsModalOpen(false))

  // 切换模态框中的选项卡
  const onTabChange = (key) => setActiveTabKey(key)

  // 处理登录或注册表单提交
  const onFinish = async (values, type) => {
    if (type === 'login') {
      try {
        const res = await dispatch(fetchLogin(values))
        if (res.data.code === 200) {
          await dispatch(fetchUserInfo())
          message.success(res.data.message)
          closeModal()
          dispatch(setIsLoginOpen(false))
        } else {
          message.error(res.data.err)
        }
      } catch (error) {
        // 处理请求失败的情况，如网络错误等
        message.error('请求失败，请检查网络连接')
      }
    } else if (type === 'register') {
      const res = await dispatch(fetchRegister(values))
      console.log(res)
      if (res.data.code === 200) {
        message.success(res.data.message)
        setActiveTabKey('login')
      } else {
        message.error(res.data.err)
      }
    }
  }

  // 根据当前激活的选项卡显示对应的登录或注册组件
  const contentList = {
    login: <Login onFinish={(values) => onFinish(values, 'login')} />,
    register: <Register onFinish={(values) => onFinish(values, 'register')} />,
  }

  return (
    <>
      <div className='nav'>
        <Row>
          <Col span={2}>
            <div className='logo'>
              <img src={Logo} alt='蜡笔课堂' />
              <p>蜡笔课堂</p>
            </div>
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
            {isLoginOpen ? (
              <ul className='menu'>
                <li className='menu-item'>
                  <Link onClick={openModal}>登录</Link>
                </li>
              </ul>
            ) : (
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
            )}
          </Col>
        </Row>
        <Modal footer={null} open={isModalOpen} onCancel={closeModal}>
          <Card
            style={{ width: '100%', marginTop: '30px' }}
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            {contentList[activeTabKey]}
          </Card>
        </Modal>
      </div>
      <Outlet />
    </>
  )
}
