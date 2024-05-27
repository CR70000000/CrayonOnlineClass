import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import Logo from '@/assets/Logo.png'

export default function FootWrap() {
  return (
    <div className='container'>
      <div className='foot-wrap'>
        <div className='logo'>
          <img src={Logo} alt='logo' />
          <Link to='/'>蜡笔课堂</Link>
        </div>
        <div className='foot-info'>
          <div className='nav-list'>
            <Link className='nav-list-item' to='/'>
              首页
            </Link>
            <Link className='nav-list-item' to='/course'>
              课程
            </Link>
            <Link className='nav-list-item' to='/learnpath'>
              学习路线
            </Link>
          </div>
          <div>
            <span>课程内容版权均归 蜡笔课堂 版权所有</span>
          </div>
        </div>
      </div>
    </div>
  )
}
