import React from 'react';
import {Layout, Menu} from 'antd';

import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {CloudOutlined, CopyOutlined, DiffOutlined} from '@ant-design/icons';

const {Content, Sider} = Layout;

const items = [
  {key: 'projects', label: '工程列表', icon: <CopyOutlined />},
  {key: 'templates', label: '模板列表', icon: <DiffOutlined />}
];
const Home = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const defaultKey = pathname?pathname.replace('/home/',''):'projects';

  return (
    <Layout>
      <Sider
        style={{height: '100vh', background:'#1a1d21'}}
      >
        <div className="logo" >
          <CloudOutlined /> 云剪辑demo
        </div>
        <Menu theme="dark" defaultSelectedKeys={[defaultKey]} items={items}
          style={{background:'#1a1d21'}}
          mode="inline"
          inlineCollapsed={true}
          onSelect={(selectInfo) => {
            navigate(selectInfo.key)
          }}
        />
      </Sider>
      <Layout>
        <Content >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;