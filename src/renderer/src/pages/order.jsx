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



  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let data = await window.api.getMoneys(searchText, currentPage, pageSize);
      setOrders(data);
      setTotal(data.length); // 这里需要根据实际返回的数据结构调整
      console.log('订单列表数据:', data);
    } catch (err) {
      console.error('获取订单列表失败:', err);
    } finally {
      setLoading(false);
    }
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
            <span>{record.phone}</span>
          </Space>
        </Space>
      )
    },
    {
      title: '变动前金额',
      dataIndex: 'price_before',
      key: 'price_before',
      render: (price_before) => (
        <span style={{ color: '#666' }}>
          ¥{price_before.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.beforeAmount - b.beforeAmount,
    },
    {
      title: '变动后金额',
      dataIndex: 'price_after',
      key: 'price_after',
      render: (price_after) => (
        <span style={{ color: '#666' }}>
          ¥{price_after.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.afterAmount - b.afterAmount,
    },
    {
      title: '变动金额',
      dataIndex: 'counts',
      key: 'counts',
      render: (counts, record) => (
        <Tag
          color={record.type === '充值' ? 'green' : 'red'}
          icon={record.type === '充值' ? <DollarOutlined /> : <WalletOutlined />}
        >
          {record.type === '充值' ? '+' : ''}{counts.toFixed(2)}
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
          <span>管理员</span>
        </Space>
      )
    },
    {
      title: '操作时间',
      dataIndex: 'created_at',
      key: 'created_at'
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