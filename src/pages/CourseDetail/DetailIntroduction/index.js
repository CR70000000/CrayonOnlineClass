import { React } from 'react'
import { Card, Avatar, Image } from 'antd'

const { Meta } = Card

export default function CourseIntroduction({ data }) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Card
          style={{ width: 300, marginRight: 20 }}
          cover={<img alt='example' src={data?.pic} />}
        >
          <Meta
            avatar={<Avatar size={55} src={data?.teacher_pic} />}
            title={data?.teacher}
            description={data?.teacher_desc}
          />
        </Card>
        <Card style={{ flex: 1 }} type='inner' title={data?.category}>
          <p>{data?.introduction}</p>
        </Card>
      </div>
      <Card
        style={{
          marginTop: 20,
          width: '100%',
        }}
      >
        <Image width={'100%'} src={data?.detail_pic} />
      </Card>
    </div>
  )
}
