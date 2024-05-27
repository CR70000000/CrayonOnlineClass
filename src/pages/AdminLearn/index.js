import React, { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Form,
  Modal,
  Space,
  Table,
  Tag,
  message,
  Select,
} from 'antd'
import { SketchPicker } from 'react-color' // 引入颜色选择器组件
import './index.css'
import axios from 'axios'

const { Search } = Input

const url = (endpoint) => `http://localhost:3001/${endpoint}`

export default function Course() {
  const [routesList, setRoutesList] = useState([]) // 存储学习路线列表
  const [editingRoute, setEditingRoute] = useState({ id: undefined }) // 当前正在编辑的学习路线
  const [id, setId] = useState(null) // 编辑的学习路线ID
  const [open, setOpen] = useState(false) // 控制模态框的显示
  const [color, setColor] = useState() // 存储颜色选择器的颜色

  useEffect(() => {
    fetchData() // 组件加载完成后获取数据
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get(url('learnpath/parent'))
      setRoutesList(res.data.data.map((item) => ({ ...item, key: item.id })))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const showModal = () => {
    setOpen(true) // 显示模态框
  }

  const hideModal = () => {
    setOpen(false) // 隐藏模态框
  }

  const add = () => {
    setEditingRoute({ id: undefined }) // 重置编辑数据
    setId(null) // 重置ID
    showModal() // 显示模态框以添加新学习路线
  }

  const edit = (record) => {
    setId(record.id) // 设置当前编辑ID
    setColor(record.color || '#fff') // 设置当前颜色
    setEditingRoute(record) // 设置当前编辑的学习路线
    showModal() // 显示模态框
  }

  const del = async (id) => {
    try {
      const res = await axios.delete(url(`learnpath/parent/delete/${id}`))
      if (res.data.code === 200) {
        message.success(res.data.message)
        fetchData() // 重新获取数据
      }
    } catch (error) {
      message.error('删除失败')
      console.error('Error deleting route:', error)
    }
  }

  const onFinish = async (values) => {
    values.color = color // 添加颜色到表单数据
    const apiPath = id ? 'learnpath/parent/update' : 'learnpath/parent/add'
    try {
      const res = await axios.post(url(apiPath), { ...values, id })
      if (res.data.code === 200) {
        message.success(res.data.message)
        fetchData()
        hideModal()
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo)
  }

  // 渲染学习路线的表格
  const columns = [
    {
      title: '学习路线ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '学习路线名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学习路线介绍',
      dataIndex: 'introduction',
      key: 'introduction',
    },
    {
      title: '学习路线序号',
      dataIndex: 'parent_route_id',
      key: 'parent_route_id',
    },
    {
      title: '子路线颜色',
      dataIndex: 'color',
      key: 'color',
      render: (color) => <Tag color={color}>{color}</Tag>,
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
      <Button
        style={{ marginLeft: '20px', marginBottom: '20px' }}
        type='primary'
        onClick={add}
      >
        添加
      </Button>
      <Search
        placeholder='输入想要搜索的学习路线名称'
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
        title='学习路线管理'
        open={open}
        onCancel={hideModal}
        footer={null}
      >
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={editingRoute}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='名称'
            name='name'
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='描述'
            name='introduction'
            rules={[{ required: true, message: '请输入描述!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='子路线序号'
            name='parent_route_id'
            rules={[{ required: true, message: '请选择一个序号' }]}
          >
            <Select>
              <Select.Option value={1} key='1'>
                1
              </Select.Option>
              <Select.Option value={2} key='2'>
                2
              </Select.Option>
              <Select.Option value={3} key='3'>
                3
              </Select.Option>
              <Select.Option value={4} key='4'>
                4
              </Select.Option>
              <Select.Option value={5} key='5'>
                5
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='子路线颜色'>
            <SketchPicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
