import { React, useEffect, useState } from 'react'
import './index.css'
import { UploadOutlined } from '@ant-design/icons'

import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Upload,
  Select,
  message,
} from 'antd'
import axios from 'axios'
import { getStaticUrl } from '@/utils/picUrl'
import UserAuthorization from '@/components/UserAuthorization'

const { Search } = Input

function Courses() {
  // 使用状态来存储列表数据
  const [routesList, setRoutesList] = useState([])
  const [parentList, setParentList] = useState([])

  // 编辑时使用的状态
  const [editingRoute, setEditingRoute] = useState({
    id: '',
    name: '',
    description: '',
  })
  const [id, setId] = useState(null)

  // 上传组件的文件列表
  const [fileList, setFileList] = useState([])

  // 表格列定义
  const columns = [
    {
      title: '子目录ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '子目录名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '课程视频',
      dataIndex: 'video',
      key: 'video',
      render: (text) => (
        <video width={50} height={50} src={getStaticUrl(text)}></video>
      ),
    },
    {
      title: '父级目录',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (text) => (
        <span>
          {parentList.find((item) => item.id === text)?.name || '未知'}
        </span>
      ),
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

  // 从后端API获取数据
  useEffect(() => {
    fetchData()
  }, [])

  // 编辑记录
  const edit = (record) => {
    setId(record.id)
    setEditingRoute(record)
    showModal()
  }

  // 上传组件配置
  const uploadProps = {
    name: 'image',
    action: 'http://localhost:3001/upload',
    fileList,
    onChange(info) {
      setFileList(info.fileList)
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    },
  }

  // 删除记录
  const del = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/catalog/child/delete/${id}`,
      )
      if (res.data.code === 200) {
        message.success(res.data.message)
        fetchData()
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.error('删除记录出错:', error)
    }
  }

  // 显示和隐藏模态框
  const [open, setOpen] = useState(false)
  const showModal = () => setOpen(true)
  const hideModal = () => setOpen(false)

  // 添加新记录的按钮操作
  const add = () => {
    setId(null) // 清空id表示添加新记录
    setEditingRoute({ id: '', name: '', description: '' }) // 清空表单
    showModal()
  }

  // 获取数据
  const fetchData = async () => {
    try {
      let res = await axios.get('http://localhost:3001/catalog/child')
      setRoutesList(res.data.data.map((item) => ({ ...item, key: item.id })))
      res = await axios.get('http://localhost:3001/catalog/parent')
      setParentList(res.data.data.map((item) => ({ ...item, key: item.id })))
    } catch (error) {
      console.error('获取数据出错:', error)
    }
  }

  // 表单完成后的处理
  const onFinish = async (values) => {
    const lastFile = fileList.slice(-1)[0]
    values.video = lastFile && lastFile.response && lastFile.response.imageUrl

    try {
      let res
      if (!id) {
        res = await axios.post(
          'http://localhost:3001/catalog/child/add',
          values,
        )
      } else {
        values.id = id
        res = await axios.post(
          'http://localhost:3001/catalog/child/update',
          values,
        )
      }
      if (res.data.code === 200) {
        message.success(res.data.message)
        fetchData()
        hideModal()
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.error('添加或更新记录出错:', error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('表单提交失败:', errorInfo)
  }

  return (
    <>
      <Button
        style={{
          marginLeft: '20px',
          marginBottom: '20px',
        }}
        type='primary'
        onClick={add}
      >
        添加
      </Button>
      <Search
        placeholder='输入想要搜索的课程'
        allowClear
        style={{ width: 200, marginLeft: '20px' }}
        // onSearch={(value) => setSearchText(value)}
      />
      <Table
        pagination={{
          pageSize: 10, // 每页显示的记录数
          showTotal: (total) => `共 ${total} 条记录`, // 显示总记录数
        }}
        columns={columns}
        dataSource={routesList}
      />
      <Modal
        footer={null}
        title='子目录管理'
        open={open}
        maskClosable={true}
        onCancel={hideModal}
      >
        <Form
          name='basic'
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
            label='子目录名称'
            name='name'
            rules={[
              {
                required: true,
                message: '请输入名称!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='父级目录' name='parent_id'>
            <Select placeholder='请选择父级目录'>
              {parentList.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='课程视频' name='video'>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const Course = UserAuthorization(Courses)

export default Course
