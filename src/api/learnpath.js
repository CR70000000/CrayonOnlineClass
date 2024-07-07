import { request } from '@/utils'

// 获取全部学习路线
export const learnpathListAPI = () => {
  return request({
    url: '/api/learnpath/list',
    method: 'get',
  })
}

// 根据id获取二级路线数据
export const subLearnpathListByIdAPI = (id) => {
  return request({
    url: `/api/learnpath/sublist/${id}`,
    method: 'get',
  })
}

// 获取全部二级路线数据
export const subLearnpathChildListAllAPI = () => {
  return request({
    url: '/learnpath/child/list',
    method: 'get',
  })
}
