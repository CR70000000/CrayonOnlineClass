import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'normalize.css'
// 导入路由
import Router from './router/index'
import { BrowserRouter } from 'react-router-dom'
// 导入redux
import store from './store'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <Router />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>,
)
