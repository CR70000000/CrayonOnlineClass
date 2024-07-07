import { getToken } from '@/utils'
import { message } from 'antd'
import { Navigate } from 'react-router-dom'

function UserAuthorization(WrappedComponent) {
  return function (props) {
    const token = getToken() // 获取token
    if (!token) {
      // 提示
      message.warning('请先登录')
      // 未登录，跳转到登录页面
      return <Navigate to='/' replace={true} />
    }
    return <WrappedComponent {...props} />
  }
}

export default UserAuthorization
