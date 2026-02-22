import { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import User from './pages/user';
import Order from './pages/order';
import System from './pages/system';
import About from './pages/about';

const { Header, Content, Footer } = Layout;

const items = [
  {
    key: 'user',
    icon: <PieChartOutlined />,
    label: '用户管理',
  },
  {
    key: 'order',
    icon: <DesktopOutlined />,
    label: '订单管理',
  },
  {
    key: 'system',
    icon: <ContainerOutlined />,
    label: '系统管理',
  },
  {
    key: 'about',
    icon: <AppstoreOutlined />,
    label: '关于我们',
  },

]


function App() {
  const [currentItem, setCurrentItem] = useState('user')

  const itemSelected = ({ key }) => {
    console.log(key)
    setCurrentItem(key)
  }
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[currentItem]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={itemSelected}
        />
      </Header>
      <Content style={{ padding: 0 }}>
        <div
          style={{
            padding: 1,
            minHeight: 'calc(100vh - 150px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {currentItem === 'user' && <User />}
          {currentItem === 'order' && <Order />}
          {currentItem === 'system' && <System />}
          {currentItem === 'about' && <About />}

        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;