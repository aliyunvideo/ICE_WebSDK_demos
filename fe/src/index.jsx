import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter} from 'react-router-dom'
import {ConfigProvider} from 'antd'
import './index.css'
import App from './App'

ConfigProvider.config({
  prefixCls: 'biz-ant',
  iconPrefixCls: 'biz-anticon',
});

ReactDOM.render(
  <HashRouter>
    <ConfigProvider prefixCls='biz-ant' iconPrefixCls='biz-anticon' >
      <App />
    </ConfigProvider>
  </HashRouter>,
  document.getElementById('root')
)
