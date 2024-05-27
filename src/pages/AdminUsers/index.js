import { React, useEffect, useState, useRef } from 'react'
import './index.css'
import { UploadOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Upload,
  message,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAddUser,
  fetchDeleteUser,
  fetchGetAllUser,
  fetchUpdateUser,
} from '@/store/modules/user'
const { Search } = Input

export default function Course() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const formRef = useRef(null)
  // 用户列表状态
  const [userList, setUserList] = useState([])
  // 当前编辑的用户ID
  const [id, setId] = useState(null)
  // 模态框开关状态
  const [open, setOpen] = useState(false)
  // 当前编辑的用户信息
  const [editingRoute, setEditingRoute] = useState({ category: '' })
  // 文件列表状态
  const [fileList, setFileList] = useState([])
  const [searchText, setSearchText] = useState('')

  // 用户头像上传请求
  const uploadProps = {
    // 上传组件的配置
    name: 'file',
    action: 'http://localhost:8080/upload',
    headers: {
      authorization: token,
    },
    fileList,
    onChange(info) {
      // 更新文件列表
      setFileList(info.fileList)
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)

        console.log(fileList)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    },
  }

  useEffect(() => {
    if (!open) {
      // 关闭模态框时清空文件列表
      setFileList([])
    }
  }, [open])

  // 获取用户信息列表
  const fetchData = async () => {
    const res = await dispatch(fetchGetAllUser())
    if (res.data.code === 200) {
      setUserList(res.data.data.map((item) => ({ ...item, key: item.id })))
    } else {
      message.error(res.data.err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [dispatch])

  // 搜索用户
  useEffect(() => {
    const filterUsers = async () => {
      const res = await dispatch(fetchGetAllUser())
      const filteredData = res.data.data
        .filter(
          (user) =>
            user.phone.includes(searchText) ||
            user.username.includes(searchText),
        )
        .map((item) => ({ ...item, key: item.id }))
      setUserList(filteredData)
    }
    filterUsers()
  }, [searchText, setUserList])

  // 显示模态框
  const showModal = () => setOpen(true)
  // 隐藏模态框
  const hideModal = () => {
    setOpen(false)
    // 调用 resetFields 方法重置表单
    formRef.current.resetFields()
    console.log(formRef)
  }

  const edit = async (record) => {
    // 编辑用户
    setEditingRoute(record)
    setId(record.id)
    showModal()
  }

  // 删除操作
  const del = async (id) => {
    const res = await dispatch(fetchDeleteUser(id))
    if (res.data.code === 200) {
      message.success(res.data.message)
      fetchData()
    } else {
      message.error(res.data.err)
    }
  }

  const onFinish = async (values) => {
    // 表单提交
    values.avatar = fileList[0]?.response.url
    if (!id) {
      const res = await dispatch(fetchAddUser(values))
      if (res.data.code === 200) {
        await message.success(res.data.message)
        fetchData()
        hideModal()
      } else {
        message.error(res.data.err)
      }
    } else {
      const res = await dispatch(fetchUpdateUser(id, values))
      if (res.data.code === 200) {
        await message.success(res.data.message)
        fetchData()
        hideModal()
      } else {
        message.error(res.data.err)
      }
    }
  }

  const onFinishFailed = (errorInfo) => {
    message.error('表单提交失败,请重新提交')
    // 表单提交失败
    console.log('提交失败:', errorInfo)
  }

  const columns = [
    // 表格列的配置
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => <Avatar size={50} src={text} />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span>{text === 0 ? '普通用户' : '管理员'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => edit(record)}>
            编辑
          </Button>
          <Button type='primary' danger onClick={() => del(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div>
        <Button
          style={{
            marginLeft: '20px',
            marginBottom: '20px',
          }}
          type='primary'
          onClick={() => {
            setId(null) // 确保添加用户时没有旧的 id
            setEditingRoute({}) // 清除编辑信息
            showModal()
          }}
        >
          添加
        </Button>
        <Search
          placeholder='输入想要搜索的用户'
          allowClear
          style={{ width: 200, marginLeft: '20px' }}
          onSearch={(value) => setSearchText(value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={userList}
        pagination={{
          pageSize: 10, // 每页显示的记录数
          showTotal: (total) => `共 ${total} 条记录`, // 显示总记录数
        }}
      />
      <Modal
        footer={null}
        // 根据 id 显示不同的标题
        title={id ? '编辑用户' : '添加用户'}
        open={open}
        maskClosable={true}
        onCancel={hideModal}
        destroyOnClose={true}
        onAfterClose={() => {
          // 在 Modal 完全关闭后重置表单
          if (formRef.current) {
            console.log(formRef)
            formRef.current.resetFields()
          }
        }}
      >
        <Form
          ref={formRef}
          name='form'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={editingRoute}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='手机号'
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
          <Form.Item
            label='密码'
            name='password'
            rules={[
              {
                message:
                  '至少一个大写字母、一个小写字母和一个数字，并且长度至少为8位！',
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='头像' name='avatar'>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label='用户名'
            name='username'
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='用户类型' name='type'>
            <Select placeholder='选择用户类型'>
              <Select.Option value={0}>普通用户</Select.Option>
              <Select.Option value={1}>管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {!id ? (
              <Button type='primary' htmlType='submit'>
                确定
              </Button>
            ) : (
              <Button type='primary' htmlType='submit'>
                修改
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
