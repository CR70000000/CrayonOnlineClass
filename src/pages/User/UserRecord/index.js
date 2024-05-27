import React, { useEffect } from 'react'
import { List, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeleteRecord, fetchUserRecordList } from '@/store/modules/record'

export default function UserRecord() {
  const dispatch = useDispatch()
  // 用户学习记录列表
  const recordList = useSelector((state) => state.record.recordList)

  useEffect(() => {
    fetchData()
    async function fetchData() {
      await dispatch(fetchUserRecordList())
    }
  }, [dispatch])

  // 删除记录
  const handleDelete = async (recordId) => {
    const res = await dispatch(fetchDeleteRecord(recordId))
    console.log(res)
    if (res.data.code === 200) {
      message.success(res.data.message)
      await dispatch(fetchUserRecordList())
    } else {
      message.error(res.data.err)
    }
  }

  return (
    <div>
      <List
        itemLayout='horizontal'
        dataSource={recordList}
        renderItem={(item) => (
          <List.Item key={item?.id}>
            <List.Item.Meta
              title={
                <Link to={`/course/video/${item?.child_catalog_id}`}>
                  {item.name}
                </Link>
              }
              description={item.ctime.replace('T', ' ').slice(0, 19)}
            />
            <Button
              type='primary'
              size='small'
              onClick={() => handleDelete(item.id)}
            >
              删除
            </Button>
          </List.Item>
        )}
      />
    </div>
  )
}
