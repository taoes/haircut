import { useState } from 'react';
import { Flex, Layout, Menu, theme,Space,Dropdown } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
  DownOutlined
} from '@ant-design/icons';
import User from './pages/user';
import Order from './pages/order';
import System from './pages/system';
import About from './pages/about';

const { Header, Content, Footer, Sider } = Layout;

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

const dropdownItem = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com"></a>
    )
  }
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
        <Flex>
          <div className="demo-logo" >
            <span style={{ color: '#fff', fontSize: '18px' }}>客户订单管理系统</span>
          </div>

          <Dropdown menu={{ dropdownItem }}>
            
          </Dropdown>
        </Flex>

      </Header>

      <Layout>
        <Sider width={200} style={{ background: colorBgContainer, height: 'calc(100vh - 64px)' }}>

          <Menu
            mode="vertical"
            defaultSelectedKeys={[currentItem]}
            items={items}
            style={{ flex: 1, minWidth: 0, height: '100%' }}
            onClick={itemSelected}
          />
        </Sider>
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
      </Layout>

      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;