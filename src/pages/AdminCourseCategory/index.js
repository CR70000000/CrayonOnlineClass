import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Modal, Form, Input, message, Space } from 'antd'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {
  fetchCourseCategoryList,
  fetchDeleteCourseCategoryById,
  fetchUpdateCourseCategoryById,
} from '@/store/modules/course'
import UserAuthorization from '@/components/UserAuthorization'

function AdminCourseCategorys() {
  const dispatch = useDispatch()
  const formRef = useRef(null)
  // 存储分类列表
  const [categoryList, setCategoryList] = useState([])
  // 当前正在编辑的分类
  const [editingCategory, setEditingCategory] = useState({})
  // 当前编辑项的ID
  const [id, setId] = useState(null)
  // 控制模态框的显示状态
  const [modalOpen, setModalOpen] = useState(false)

  const columns = [
    {
      title: '分类ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '分类名称',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: '分类序号',
      dataIndex: 'category_order',
      key: 'category_order',
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
    fetchData() // 加载数据
  }, [])

  // 获取分类数据
  const fetchData = async () => {
    const res = await dispatch(fetchCourseCategoryList())
    if (res.data.code === 200) {
      setCategoryList(res.data.data)
    } else {
      message.error(res.data.err)
    }
  }

  // 编辑分类
  const edit = (record) => {
    setId(record.id)
    setEditingCategory(record)
    setModalOpen(true)
  }

  // 删除分类
  const del = async (categoryid) => {
    const res = await dispatch(fetchDeleteCourseCategoryById(categoryid))
    console.log(res)
    // try {
    //   const response = await axios.delete(
    //     `http://localhost:3001/courses/categories/${id}`,
    //   )
    //   if (response.data.code === 200) {
    //     message.success(response.data.message)
    //     fetchData()
    //   } else {
    //     message.error(response.data.message)
    //   }
    // } catch (error) {
    //   console.error('删除分类出错:', error)
    // }
  }

  // 添加新分类
  const add = () => {
    setEditingCategory({})
    setId(null)
    setModalOpen(true)
  }

  // 表单提交
  const onFinish = async (values) => {
    if (id) {
      const res = await dispatch(fetchUpdateCourseCategoryById(id, values))
      console.log(res)
    }

    // try {
    //   const url = id
    //     ? `http://localhost:3001/courses/categories/${id}`
    //     : 'http://localhost:3001/courses/categories'
    //   const method = id ? 'put' : 'post'
    //   const response = await axios[method](url, values)
    //   if (response.data.code === 200) {
    //     message.success(response.data.message)
    //     fetchData()
    //     setModalOpen(false)
    //   } else {
    //     message.error(response.data.message)
    //   }
    // } catch (error) {
    //   console.error('提交表单失败:', error)
    // }
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
        style={{ marginLeft: '20px', marginBottom: '20px' }}
      >
        添加
      </Button>
      <Table
        dataSource={categoryList}
        columns={columns}
        pagination={{
          pageSize: 10, // 每页显示的记录数
          showTotal: (total) => `共 ${total} 条记录`, // 显示总记录数
        }}
        rowKey='id'
      />
      <Modal
        title='添加/编辑分类'
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form
          name='basic'
          initialValues={editingCategory}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete='off'
        >
          <Form.Item
            label='分类名称'
            name='category_name'
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='分类序号'
            name='category_order'
            rules={[{ required: true, message: '请输入分类序号!' }]}
          >
            <Input type='number' />
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

const AdminCourseCategory = UserAuthorization(AdminCourseCategorys)

export default AdminCourseCategory
