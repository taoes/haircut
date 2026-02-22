import { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Space, 
  Tag,
  Button
} from 'antd';
import { 
  SearchOutlined,
  WalletOutlined,
  UserOutlined,
  DollarOutlined
} from '@ant-design/icons';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 模拟订单数据
  const mockOrders = [
    {
      id: 1,
      userName: '张三',
      userPhone: '13800138001',
      beforeAmount: 1200.50,
      afterAmount: 1150.50,
      changeAmount: -50.00,
      operator: '管理员A',
      operateTime: '2024-03-20 14:30:00',
      type: 'consume' // consume: 消费, recharge: 充值
    },
    {
      id: 2,
      userName: '李四',
      userPhone: '13800138002',
      beforeAmount: 850.00,
      afterAmount: 950.00,
      changeAmount: 100.00,
      operator: '管理员B',
      operateTime: '2024-03-19 16:45:00',
      type: 'recharge'
    },
    {
      id: 3,
      userName: '王五',
      userPhone: '13800138003',
      beforeAmount: 2300.80,
      afterAmount: 2200.80,
      changeAmount: -100.00,
      operator: '管理员A',
      operateTime: '2024-03-18 10:15:00',
      type: 'consume'
    },
    {
      id: 4,
      userName: '赵六',
      userPhone: '13800138004',
      beforeAmount: 500.00,
      afterAmount: 800.00,
      changeAmount: 300.00,
      operator: '管理员C',
      operateTime: '2024-03-17 13:20:00',
      type: 'recharge'
    },
    {
      id: 5,
      userName: '张三',
      userPhone: '13800138001',
      beforeAmount: 1150.50,
      afterAmount: 1100.50,
      changeAmount: -50.00,
      operator: '管理员B',
      operateTime: '2024-03-16 09:30:00',
      type: 'consume'
    }
  ];

  // 获取订单列表
  const fetchOrders = () => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      let filteredOrders = [...mockOrders];
      
      // 搜索过滤
      if (searchText) {
        filteredOrders = filteredOrders.filter(order => 
          order.userName.includes(searchText) || 
          order.userPhone.includes(searchText)
        );
      }
      
      // 按时间倒序排列
      filteredOrders.sort((a, b) => 
        new Date(b.operateTime) - new Date(a.operateTime)
      );
      
      // 分页处理
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      setOrders(paginatedOrders);
      setTotal(filteredOrders.length);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, searchText]);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户信息',
      key: 'userInfo',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <UserOutlined />
            <span>{record.userName}</span>
          </Space>
          <Space style={{ fontSize: '12px', color: '#888' }}>
            <span>{record.userPhone}</span>
          </Space>
        </Space>
      )
    },
    {
      title: '变动前金额',
      dataIndex: 'beforeAmount',
      key: 'beforeAmount',
      render: (amount) => (
        <span style={{ color: '#666' }}>
          ¥{amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.beforeAmount - b.beforeAmount,
    },
    {
      title: '变动后金额',
      dataIndex: 'afterAmount',
      key: 'afterAmount',
      render: (amount) => (
        <span style={{ color: '#666' }}>
          ¥{amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.afterAmount - b.afterAmount,
    },
    {
      title: '变动金额',
      dataIndex: 'changeAmount',
      key: 'changeAmount',
      render: (amount) => (
        <Tag 
          color={amount > 0 ? 'green' : 'red'}
          icon={amount > 0 ? <DollarOutlined /> : <WalletOutlined />}
        >
          {amount > 0 ? '+' : ''}{amount.toFixed(2)}
        </Tag>
      ),
      sorter: (a, b) => a.changeAmount - b.changeAmount,
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'recharge' ? 'blue' : 'orange'}>
          {type === 'recharge' ? '充值' : '消费'}
        </Tag>
      ),
      filters: [
        { text: '充值', value: 'recharge' },
        { text: '消费', value: 'consume' }
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      render: (operator) => (
        <Space>
          <span>{operator}</span>
        </Space>
      )
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      sorter: (a, b) => new Date(a.operateTime) - new Date(b.operateTime),
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          订单管理
        </h1>
        
        {/* 搜索区域 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <Space>
            <Input
              placeholder="请输入用户名或手机号搜索"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              onPressEnter={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={(e) => {
                const input = e.target.closest('.ant-input-affix-wrapper')?.querySelector('input');
                handleSearch(input?.value || '');
              }}
            >
              搜索
            </Button>
          </Space>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            共 {total} 条订单记录
          </div>
        </div>
      </div>

      {/* 订单表格 */}
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          onShowSizeChange: (current, size) => {
            setPageSize(size);
            setCurrentPage(1);
          }
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}

export default Order;