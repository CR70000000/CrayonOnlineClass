import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Form, Input, Select, message, Space } from 'antd'
import axios from 'axios'

const { Search } = Input

export default function Course() {
  // 路径列表的状态
  const [routesList, setRoutesList] = useState([])
  // 当前编辑中的路径对象的状态
  const [editingRoute, setEditingRoute] = useState({})
  // 当前编辑项的ID
  const [id, setId] = useState(null)
  // 模态框的打开状态
  const [modalOpen, setModalOpen] = useState(false)
  // 课程列表的状态
  const [courseList, setCourseList] = useState([])

  // 表格列的定义
  const columns = [
    {
      title: '父目录ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '章节名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '对应课程',
      dataIndex: 'course_id',
      key: 'course',
      render: (text) => (
        <span>{courseList.find((course) => course.id === text)?.category}</span>
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

  // 组件加载时获取数据
  useEffect(() => {
    fetchData()
  }, [])

  // 编辑记录，设置当前编辑项并显示模态窗口
  const edit = (record) => {
    setId(record.id)
    setEditingRoute(record)
    setModalOpen(true)
  }

  // 删除记录
  const del = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/catalog/parent/delete/${id}`,
      )
      if (response.data.code === 200) {
        message.success(response.data.message)
        fetchData()
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('删除课程出错:', error)
    }
  }

  // 添加新记录
  const add = () => {
    setEditingRoute({}) // 清空编辑内容
    setId(null)
    setModalOpen(true)
  }

  // 获取数据
  const fetchData = async () => {
    try {
      const routesResponse = await axios.get(
        'http://localhost:3001/catalog/parent',
      )
      setRoutesList(
        routesResponse.data.data.map((item) => ({ ...item, key: item.id })),
      )
      const coursesResponse = await axios.get(
        'http://localhost:3001/courses/list',
      )
      setCourseList(
        coursesResponse.data.data.map((item) => ({ ...item, key: item.id })),
      )
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }

  // 表单提交
  const onFinish = async (values) => {
    try {
      const endpoint = id ? 'update' : 'add'
      const response = await axios.post(
        `http://localhost:3001/catalog/parent/${endpoint}`,
        { ...values, id },
      )
      if (response.data.code === 200) {
        message.success(response.data.message)
        fetchData()
        setModalOpen(false)
      } else {
        message.error(response.data.message)
      }
    } catch (error) {
      console.error('提交表单失败:', error)
    }
  }

  // 表单提交失败处理
  const onFinishFailed = (errorInfo) => {
    console.error('表单提交失败:', errorInfo)
  }

  return (
    <>
      <Button
        type='primary'
        onClick={add}
        style={{ marginBottom: '20px', marginLeft: '20px' }}
      >
        添加
      </Button>
      <Search
        placeholder='输入想要搜索的章节'
        allowClear
        style={{ width: 200, marginLeft: '20px' }}
        // onSearch={(value) => setSearchText(value)}
      />
      <Table
        dataSource={routesList}
        columns={columns}
        pagination={{
          pageSize: 10, // 每页显示的记录数
          showTotal: (total) => `共 ${total} 条记录`, // 显示总记录数
        }}
      />
      <Modal
        title='父章节管理'
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form
          name='basic'
          initialValues={editingRoute}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete='off'
        >
          <Form.Item
            label='章节名称'
            name='name'
            rules={[{ required: true, message: '章节名称不能为空!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='对应课程' name='course_id'>
            <Select placeholder='请选择课程'>
              {courseList.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.category}
                </Select.Option>
              ))}
            </Select>
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
