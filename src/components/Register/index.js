import React from 'react'
import { Form, Input, Button } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

export default function Register({ onFinish }) {
  return (
    <div>
      <Form
        name='normal_register'
        initialValues={{
          remember: true,
        }}
        onFinish={(values) => onFinish(values, 'register')}
        style={{
          width: '100%',
        }}
      >
        <Form.Item
          name='phone'
          rules={[
            {
              required: true,
              message: '请输入正确的手机号!',
              pattern: /^1[3456789]\d{9}$/,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='手机号' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message:
                '至少包含一个大写字母、一个小写字母和一个数字，长度至少为8位!',
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='密码' />
        </Form.Item>
        <Form.Item
          name='confirm'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请再次输入密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不相同!'))
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='确认密码' />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              width: '100%',
            }}
          >
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
