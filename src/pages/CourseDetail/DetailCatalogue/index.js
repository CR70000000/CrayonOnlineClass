import React from 'react'
import { Menu, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

// 递归构造菜单项
function constructMenu(chapters, parentId = '') {
  return chapters.map((chapter) => {
    const uniqueKey = parentId ? `${parentId}-${chapter.id}` : `${chapter.id}`
    if (chapter.children) {
      // 如果当前章节有子章节，则递归构造子目录
      return {
        id: chapter.id,
        label: chapter.name,
        key: uniqueKey,
        children: constructMenu(chapter.children, uniqueKey),
      }
    }
    // 没有子章节，直接返回当前章节信息
    return {
      id: chapter.id,
      label: chapter.name,
      key: uniqueKey,
    }
  })
}

export default function DetailCatalogue({ data, isStudy }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const items = constructMenu(data)

  // 处理点击事件，导航到相应的课程视频页面
  const handleClick = (e) => {
    if (!isStudy === false) {
      message.warning('加入课程后才可以浏览视频')
      return
    }
    navigate(`/course/video/${e.key.split('-').pop()}?courseId=${id}`)
  }

  // 当课程目录为空时，显示提示信息
  if (items.length === 0) {
    return <h3 style={{ margin: '20px' }}>课程目录正在努力更新中！敬请期待</h3>
  }

  return <Menu mode='inline' items={items} onClick={handleClick} />
}
