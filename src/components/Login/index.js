import React from 'react'
import { Form, Input, Button } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

export default function Login({ onFinish }) {
  return (
    <div>
      <Form
        name='normal_login'
        initialValues={{
          remember: true,
        }}
        onFinish={(values) => onFinish(values, 'login')}
      >
        <Form.Item
          name='phone'
          rules={[
            {
              required: true,
              message: '请输入手机号!',
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
                '请输入密码!',
            },
          ]}
        >
          <Input prefix={<LockOutlined />} type='password' placeholder='密码' />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              width: '100%',
            }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
