import React, { useEffect, useState } from 'react'
import './index.css'
import { Button, Input, Form, Modal, Space, Table, message, Select } from 'antd'
import axios from 'axios'

const { Search } = Input

export default function Course() {
  // 存储路线列表
  const [routesList, setRoutesList] = useState([])
  // 存储父级路线列表
  const [parentList, setParentList] = useState([])
  // 当前编辑的路线
  const [editingRoute, setEditingRoute] = useState({})
  // 正在编辑的路线ID
  const [id, setId] = useState(null)
  // 控制模态框的显示
  const [open, setOpen] = useState(false)

  // 表格列定义
  const columns = [
    {
      title: '子路线ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '子路线名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '子路线描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '子路线序号',
      dataIndex: 'child_route_id',
      key: 'child_route_id',
    },
    {
      title: '父级路线',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (text) => parentList.find((p) => p.id === text)?.name || '无',
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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [routesRes, parentsRes] = await Promise.all([
        axios.get('http://localhost:3001/learnpath/child'),
        axios.get('http://localhost:3001/learnpath/parent'),
      ])
      setRoutesList(
        routesRes.data.data.map((item) => ({ ...item, key: item.id })),
      )
      setParentList(
        parentsRes.data.data.map((item) => ({ ...item, key: item.id })),
      )
    } catch (error) {
      console.error('数据加载失败:', error)
      message.error('数据加载失败')
    }
  }

  const edit = (record) => {
    setId(record.id)
    setEditingRoute(record)
    setOpen(true)
  }

  const del = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/learnpath/child/delete/${id}`,
      )
      if (res.data.code === 200) {
        message.success('删除成功')
        fetchData()
      } else {
        message.error('删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  const onFinish = async (values) => {
    console.log(values)
    const url = id
      ? 'http://localhost:3001/learnpath/child/update/'
      : 'http://localhost:3001/learnpath/child/add'
    try {
      values.id = id
      const res = await axios.post(url, values)
      if (res.data.code === 200) {
        message.success('操作成功')
        fetchData()
        setOpen(false)
        // 刷新页面
        window.location.reload()
      } else {
        message.error('操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    }
  }

  return (
    <>
      <Button
        style={{ marginBottom: 20, marginLeft: 20 }}
        type='primary'
        onClick={() => setOpen(true)}
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
        title='子路线管理'
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={editingRoute}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            label='子路线名称'
            name='name'
            rules={[{ required: true, message: '请输入子路线名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='子路线描述'
            name='description'
            rules={[{ required: true, message: '请输入子路线描述!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='子路线序号'
            name='child_route_id'
            rules={[
              {
                required: true,
                min: 1,
                max: 5,
                message: '序号为1-5的数字',
              },
            ]}
          >
            <Input type='number' />
          </Form.Item>
          <Form.Item
            label='父级路线'
            name='parent_id'
            rules={[{ required: true, message: '请选择父级路线!' }]}
          >
            <Select placeholder='请选择'>
              {parentList.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
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
