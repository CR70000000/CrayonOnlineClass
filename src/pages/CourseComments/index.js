import { useRef, useState, useEffect } from 'react'
import { message } from 'antd'
import dayjs from 'dayjs'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAddComment,
  fetchCourseCommentListByCourseId,
  fetchDeleteComment,
} from '@/store/modules/course'

export default function CourseComments({ courseId }) {
  const dispatch = useDispatch()
  // 评论列表
  const commentList = useSelector((state) => state.course.courseCommentList)
  // 用户信息
  const userInfo = useSelector((state) => state.user.userInfo)

  // 获取课程详情和评论
  const fetchData = async () => {
    const res = await dispatch(fetchCourseCommentListByCourseId(courseId))
    console.log(res)
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])

  // 删除功能
  const handleDel = async (id) => {
    const res = await dispatch(fetchDeleteComment(id))
    if (res.data.code === 200) {
      message.success(res.data.message)
      fetchData()
    }
  }

  // 发表评论
  const [content, setContent] = useState('')
  const inputRef = useRef(null)
  const handlPublish = async () => {
    const comment = {
      user_id: userInfo.id,
      content: content,
      course_id: courseId,
      ctime: dayjs(new Date()).format('YYYY-MM-DD HH:mm'),
      like: 0,
    }
    const res = await dispatch(fetchAddComment(comment))
    if (res.data.code === 200) {
      message.success(res.data.message)
      fetchData()
    }
    // 1. 清空输入框的内容
    setContent('')
    // 2. 重新聚焦
    inputRef.current.focus()
  }

  function Item({ item, onDel }) {
    const [userInfo] = useState(JSON.parse(localStorage.getItem('userInfo')))
    return (
      <div className='reply-item'>
        {/* 头像 */}
        <div className='root-reply-avatar'>
          <div className='bili-avatar'>
            <img className='bili-avatar-img' alt='用户头像' src={item.avatar} />
          </div>
        </div>

        <div className='content-wrap'>
          {/* 用户名 */}
          <div className='user-info'>
            <div className='user-name'>{item.username}</div>
          </div>
          {/* 评论内容 */}
          <div className='root-reply'>
            <span className='reply-content'>{item.content}</span>
            <div className='reply-info'>
              {/* 评论时间 */}
              <span className='reply-time'>{item.ctime}</span>
              {/* 评论数量 */}
              <span className='reply-time'>点赞数:{item.like}</span>
              {/* 条件：user.id === item.user.id */}
              {userInfo.id === item.user_id && (
                <span className='delete-btn' onClick={() => onDel(item.id)}>
                  删除
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='app'>
      <div className='reply-wrap'>
        {/* 发表评论 */}
        <div className='box-normal'>
          {/* 当前用户头像 */}
          <div className='reply-box-avatar'>
            <div className='bili-avatar'>
              <img
                className='bili-avatar-img'
                src={userInfo.avatar}
                alt='用户头像'
              />
            </div>
          </div>
          <div className='reply-box-wrap'>
            {/* 评论框 */}
            <textarea
              className='reply-box-textarea'
              placeholder='发一条友善的评论'
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {/* 发布按钮 */}
            <div className='reply-box-send'>
              <div className='send-text' onClick={handlPublish}>
                发布
              </div>
            </div>
          </div>
        </div>
        {/* 评论列表 */}
        <div className='reply-list'>
          {/* 评论项 */}
          {commentList.length > 0 ? (
            commentList.map((item) => (
              <Item
                key={item.id}
                item={item}
                onDel={() => handleDel(item.id)}
              />
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h3>暂无评论,快来发布第一条评论吧！</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
