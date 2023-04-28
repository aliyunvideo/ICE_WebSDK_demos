import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import {ConfigProvider} from 'antd'
import './index.css'
import App from './App'

ConfigProvider.config({
  prefixCls: 'tbiz-ant',
  iconPrefixCls: 'biz-anticon',
});

ReactDOM.render(
  <BrowserRouter>
     <ConfigProvider  prefixCls='biz-ant'   iconPrefixCls= 'biz-anticon' >
        <App />
     </ConfigProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
