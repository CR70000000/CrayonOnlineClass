import { React, useState } from 'react'
import { List, Avatar, Button, Modal, Form, Input, Upload, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import { UploadOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearState, setIsLoginOpen } from '@/store/modules/modal'
import {
  clearUserInfo,
  fetchUpdateUserInfo,
  fetchUserInfo,
} from '@/store/modules/user'

export default function UserInfo() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // 获取用户的信息
  const userInfo = useSelector((state) => state.user.userInfo)
  // 获取token
  const token = useSelector((state) => state.user.token)
  // 模态框的显示与关闭
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 模态框的标题显示内容
  const [activeTab, setActiveTab] = useState('')

  // 消失修改模态框
  const showModal = (value) => {
    setActiveTab(value)
    setIsModalOpen(true)
  }

  // 修改框模态框关闭
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // 修改成功后的回调
  const onFinish = async (values) => {
    const res = await dispatch(fetchUpdateUserInfo(values))
    if (res.data.code === 200) {
      message.success(res.data.message)
      handleCancel()
    } else {
      message.error(res.data.err)
    }
  }

  // 头像文件上传
  const uploadProps = {
    name: 'avatar',
    action: 'http://localhost:8080/users/myinfo',
    method: 'PATCH',
    headers: {
      authorization: token,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success('头像更改成功')
        dispatch(fetchUserInfo())
      } else if (info.file.status === 'error') {
        message.error('头像更改失败')
      }
    },
  }

  // 退出登录
  const handleLoginOut = () => {
    // 清空用户信息
    dispatch(clearUserInfo())
    // 关闭模态框
    dispatch(setIsLoginOpen(false))
    // 清除状态
    dispatch(clearState())
    // 跳转到首页
    navigate('/')
  }

  const renderModalContent = () => {
    switch (activeTab) {
      case 'avatar':
        return (
          <Form name='nameForm' onFinish={handleCancel} autoComplete='off'>
            <Form.Item name='avatar'>
              <ImgCrop rotationSlider>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传头像</Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
          </Form>
        )
      case 'name':
        return (
          <Form name='nameForm' onFinish={onFinish} autoComplete='off'>
            <Form.Item
              name='username'
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input />
            </Form.Item>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
          </Form>
        )
      case 'phone':
        return (
          <Form name='phoneForm' onFinish={onFinish} autoComplete='off'>
            <Form.Item
              name='phone'
              rules={[
                {
                  required: true,
                  message: '请输入正确的手机号！',
                  pattern: /^1[3456789]\d{9}$/,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
          </Form>
        )
      case 'password':
        return (
          <Form name='passwordForm' onFinish={onFinish} autoComplete='off'>
            <Form.Item
              label='旧密码'
              name='oldPassword'
              rules={[{ required: true, message: '请输入旧密码！' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label='新密码'
              name='password'
              rules={[
                {
                  required: true,
                  message:
                    '至少一个大写字母、一个小写字母和一个数字，并且长度至少为8位！',
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
          </Form>
        )
      default:
        return null
    }
  }

  return (
    <div className='user-info'>
      <List itemLayout='horizontal'>
        <List.Item>
          <div className='item-left'>头像</div>
          <div className='item-right'>
            <Avatar size={64} src={userInfo.avatar} />
            <span className='edit' onClick={() => showModal('avatar')}>
              修改
            </span>
          </div>
        </List.Item>
        <List.Item>
          <div className='item-left'>用户名</div>
          <div className='item-right'>
            <p>{userInfo?.username}</p>
            <span className='edit' onClick={() => showModal('name')}>
              修改
            </span>
          </div>
        </List.Item>
        <List.Item>
          <div className='item-left'>手机号</div>
          <div className='item-right'>
            <p>{userInfo?.phone}</p>
            <span className='edit' onClick={() => showModal('phone')}>
              修改
            </span>
          </div>
        </List.Item>
        <List.Item>
          <div className='item-left'>密码</div>
          <div className='item-right'>
            <p>设置安全的密码，可提升账号安全系数</p>
            <span className='edit' onClick={() => showModal('password')}>
              修改
            </span>
          </div>
        </List.Item>
        <List.Item>
          <div className='item-left'>
            <Button type='primary' danger onClick={handleLoginOut}>
              退出登录
            </Button>
          </div>
        </List.Item>
      </List>
      <Modal
        title={
          activeTab === 'avatar'
            ? '头像'
            : activeTab === 'name'
            ? '用户名'
            : activeTab === 'phone'
            ? '手机号'
            : activeTab === 'password'
            ? '密码'
            : null
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {renderModalContent()}
      </Modal>
    </div>
  )
}
