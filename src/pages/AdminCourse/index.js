import { React, useEffect, useState, useErf, useRef } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCourseCategoryList,
  fetchDeleteCourseByCourseId,
  fetchCourseList,
  fetchAddCourse,
  fetchUpdateCourse,
} from '@/store/modules/course'
import { fetchSubLearnpathChildListAll } from '@/store/modules/learnpath'
import UserAuthorization from '@/components/UserAuthorization'

const { Search } = Input

function Courses() {
  const dispatch = useDispatch()
  // 获取token
  const token = useSelector((state) => state.user.token)
  const formRef = useRef(null)
  // 当前正在编辑的课程记录
  const [editingRecord, setEditingRecord] = useState(null)
  // 正在编辑的课程ID
  const [id, setId] = useState(null)
  // 控制模态框的显示状态
  const [open, setOpen] = useState(false)
  // 课程封面的文件列表
  const [picFileList, setPicFileList] = useState([])
  // 详细图片的文件列表
  const [detailPicFileList, setDetailPicFileList] = useState([])
  // 教师头像的文件列表
  const [teacherPicFileList, setTeacherPicFileList] = useState([])
  // 课程列表
  const courseList = useSelector((state) => state.course.courseList)
  // 课程分类
  const courseTypes = useSelector((state) => state.course.courseCategoryList)
  // 全部二级学习路线
  const childRoute = useSelector((state) => state.learnpath.subLearnpathListAll)

  // 过滤后的数据
  const [filteredCourseList, setFilteredCourseList] = useState(courseList)
  const [searchText, setSearchText] = useState('')

  // 定义表格列
  const columns = [
    {
      title: '课程ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <p>{text}</p>,
    },
    { title: '课程名称', dataIndex: 'category', key: 'category' },
    {
      title: '课程封面',
      dataIndex: 'pic',
      key: 'pic',
      render: (text) => (
        <img width={50} height={50} src={text} alt='课程封面' />
      ),
    },
    {
      title: '详细图片',
      dataIndex: 'detail_pic',
      key: 'detail_pic',
      render: (text) => (
        <img width={50} height={50} src={text} alt='详细图片' />
      ),
    },
    { title: '课程简介', dataIndex: 'description', key: 'description' },
    {
      title: '课程介绍',
      dataIndex: 'introduction',
      key: 'introduction',
      render: (text) => <div className='ellipsis-text'>{text}</div>,
    },
    {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <span>{text === 0 ? '默认' : text === 1 ? '推荐' : ''}</span>
      ),
    },
    {
      title: '课程类别',
      dataIndex: 'direction',
      key: 'direction',
      render: (text) => {
        const category = courseTypes.find((cat) => cat.category_order === text)
        return <span>{category ? category.category_name : ''}</span>
      },
    },
    { title: '学习路线', dataIndex: 'route_id', key: 'route_id' },
    { title: '教师名称', dataIndex: 'teacher', key: 'teacher' },
    {
      title: '教师头像',
      dataIndex: 'teacher_pic',
      key: 'teacher_pic',
      render: (text) => (
        <img width={50} height={50} src={text} alt='教师头像' />
      ),
    },
    { title: '教师描述', dataIndex: 'teacher_desc', key: 'teacher_desc' },
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

  const fetchData = async () => {
    try {
      // 课程列表
      await dispatch(fetchCourseList())
      // 子路线列表
      await dispatch(fetchSubLearnpathChildListAll())
      // 课程类型列表
      await dispatch(fetchCourseCategoryList())
    } catch (error) {
      console.error('获取数据错误:', error)
    }
  }

  useEffect(() => {
    fetchData() // 初始化时加载数据
  }, [])

  // 打开弹窗
  const showModal = () => setOpen(true)
  // 关闭弹窗
  const hideModal = () => {
    // 清空内容
    setId(null)
    setEditingRecord(null)
    setOpen(false)
  }
  // 增加课程
  const add = () => {
    setId(null)
    setEditingRecord(null)
    showModal()
  }
  // 编辑课程
  const edit = (record) => {
    setId(record.id)
    setEditingRecord(record)
    showModal()
  }
  // 删除课程
  const del = async (id) => {
    const res = await dispatch(fetchDeleteCourseByCourseId(id))
    if (res.data.code === 200) {
      message.success(res.data.message)
      fetchData()
    } else {
      message.error(res.data.err)
    }
  }

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:8080/upload',
    headers: {
      authorization: token,
    },
  }

  const onFinish = async (values) => {
    // 从fileList中获取上传文件的URL
    const lastPicFile = picFileList[0]
    const lastDetailPicFile = detailPicFileList[0]
    const lastTeacherPicFile = teacherPicFileList[0]

    values.pic = lastPicFile && lastPicFile.response && lastPicFile.response.url
    values.detail_pic =
      lastDetailPicFile &&
      lastDetailPicFile.response &&
      lastDetailPicFile.response.url
    values.teacher_pic =
      lastTeacherPicFile &&
      lastTeacherPicFile.response &&
      lastTeacherPicFile.response.url

    console.log(values)

    try {
      let res
      if (!id) {
        // 发送POST请求到后端新增课程
        res = await dispatch(fetchAddCourse(values))
      } else {
        // 更新现有课程
        values.id = id
        res = await dispatch(fetchUpdateCourse(values))
      }
      res = res.data
      if (res.code === 200) {
        message.success(res.message)
        fetchData()
        hideModal()
        // 刷新
        setPicFileList([])
        setDetailPicFileList([])
        setTeacherPicFileList([])
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.error('添加或更新课程错误:', error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.error('表单提交失败:', errorInfo)
  }

  // 搜索课程
  useEffect(() => {
    if (searchText === '') {
      setFilteredCourseList(courseList) // 没有搜索文本时显示所有课程
    } else {
      const lowercasedFilter = searchText.toLowerCase()
      const filteredData = courseList.filter((entry) => {
        return entry.category.toLowerCase().includes(lowercasedFilter)
      })
      setFilteredCourseList(filteredData)
    }
  }, [searchText, courseList])

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
        placeholder='输入想要搜索的课程'
        allowClear
        style={{ width: 200, marginLeft: '20px' }}
        onSearch={(value) => setSearchText(value)}
      />
      <Table
        pagination={{
          pageSize: 10, // 每页显示的记录数
          showTotal: (total) => `共 ${total} 条记录`, // 显示总记录数
        }}
        columns={columns}
        // dataSource={courseList}
        dataSource={filteredCourseList}
        rowKey='id'
      />
      <Modal
        footer={null}
        title={id ? '编辑课程' : '添加课程'}
        open={open}
        maskClosable={true}
        onCancel={hideModal}
        destroyOnClose={true}
        onAfterClose={() => {
          if (formRef.current) {
            formRef.current.resetFields()
          }
        }}
      >
        <Form
          ref={formRef}
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={editingRecord}
          autoComplete='off'
        >
          <Form.Item
            label='课程名称'
            name='category'
            rules={[{ required: true, message: '请输入课程名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='课程封面' name='pic'>
            <Upload
              {...uploadProps}
              fileList={picFileList}
              onChange={(info) => {
                setPicFileList(info.fileList)
              }}
            >
              <Button icon={<UploadOutlined />}>上传课程封面</Button>
            </Upload>
          </Form.Item>
          <Form.Item label='详细图片' name='detail_pic'>
            <Upload
              {...uploadProps}
              fileList={detailPicFileList}
              onChange={(info) => {
                setDetailPicFileList(info.fileList)
                console.log(detailPicFileList)
              }}
            >
              <Button icon={<UploadOutlined />}>上传详细图片</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label='课程简介'
            name='description'
            rules={[{ required: true, message: '请输入课程描述!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='课程介绍'
            name='introduction'
            rules={[{ required: true, message: '请输入课程介绍!' }]}
          >
            <Input.TextArea rows={4} placeholder='请输入详细的课程介绍' />
          </Form.Item>

          <Form.Item label='课程类型' name='type'>
            <Select placeholder='请选择'>
              <Select.Option value={0}>默认课程</Select.Option>
              <Select.Option value={1}>推荐课程</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='课程分类' name='direction'>
            <Select placeholder='请选择'>
              {courseTypes.map((cat) => (
                <Select.Option
                  value={cat.category_order}
                  key={cat.category_order}
                >
                  {cat.category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='学习路线' name='route_id'>
            <Select placeholder='请选择'>
              {childRoute.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='教师名称'
            name='teacher'
            rules={[{ required: true, message: '请输入教师名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='教师描述'
            name='teacher_desc'
            rules={[{ required: true, message: '请输入教师描述!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='教师头像' name='teacher_pic'>
            <Upload
              {...uploadProps}
              fileList={teacherPicFileList}
              onChange={(info) => {
                setTeacherPicFileList(info.fileList)
                console.log(teacherPicFileList)
              }}
            >
              <Button icon={<UploadOutlined />}>上传教师头像</Button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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

const Course = UserAuthorization(Courses)

export default Course
