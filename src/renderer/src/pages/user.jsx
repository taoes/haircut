import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Modal,
    Form,
    Select,
    DatePicker,
    Space,
    message,
    Tag
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

function User() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [form] = Form.useForm();

    // 模拟用户数据
    const mockUsers = [
        {
            id: 1,
            phone: '13800138001',
            name: '张三',
            gender: 'male',
            balance: 1200.50,
            registerTime: '2024-01-15 10:30:00',
            lastConsumeTime: '2024-03-20 14:20:00',
            remark: 'VIP客户'
        },
        {
            id: 2,
            phone: '13800138002',
            name: '李四',
            gender: 'female',
            balance: 850.00,
            registerTime: '2024-02-01 09:15:00',
            lastConsumeTime: '2024-03-18 16:45:00',
            remark: '常客'
        },
        {
            id: 3,
            phone: '13800138003',
            name: '王五',
            gender: 'male',
            balance: 2300.80,
            registerTime: '2024-01-20 11:20:00',
            lastConsumeTime: '2024-03-22 10:30:00',
            remark: '新客户'
        }
    ];

    // 获取用户列表
    const fetchUsers = () => {
        setLoading(true);

        // 模拟API调用
        setTimeout(() => {
            let filteredUsers = [...mockUsers];

            // 搜索过滤
            if (searchText) {
                filteredUsers = filteredUsers.filter(user =>
                    user.name.includes(searchText) ||
                    user.phone.includes(searchText)
                );
            }

            // 分页处理
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

            setUsers(paginatedUsers);
            setTotal(filteredUsers.length);
            setLoading(false);
        }, 500);

        console.log(window.api);

    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, searchText]);

    // 处理搜索
    const handleSearch = (value) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    // 打开新增/编辑模态框
    const showModal = (user = null) => {
        setEditingUser(user);
        setModalVisible(true);

        if (user) {
            form.setFieldsValue({
                ...user,
                registerTime: user.registerTime ? dayjs(user.registerTime) : null,
                lastConsumeTime: user.lastConsumeTime ? dayjs(user.lastConsumeTime) : null
            });
        } else {
            form.resetFields();
        }
    };

    // 关闭模态框
    const closeModal = () => {
        setModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    // 保存用户
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingUser) {
                // 编辑用户
                const updatedUsers = users.map(user =>
                    user.id === editingUser.id
                        ? { ...user, ...values, id: editingUser.id }
                        : user
                );
                setUsers(updatedUsers);
                message.success('用户信息更新成功');
            } else {
                // 新增用户
                const newUser = {
                    id: Date.now(),
                    ...values,
                    registerTime: values.registerTime ? values.registerTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    lastConsumeTime: values.lastConsumeTime ? values.lastConsumeTime.format('YYYY-MM-DD HH:mm:ss') : ''
                };
                setUsers([...users, newUser]);
                message.success('用户添加成功');
            }

            closeModal();
        } catch (error) {
            console.error('保存失败:', error);
        }
    };

    // 删除用户
    const handleDelete = (userId) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setTotal(total - 1);
        message.success('用户删除成功');
    };

    // 表格列配置
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 80,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Space>
                        <UserOutlined />
                        <span>{record.name}</span>
                    </Space>
                    <Space style={{ fontSize: '12px', color: '#888' }}>
                        <span>{record.phone}</span>
                    </Space>
                </Space>
            )
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (
                <Tag color={gender === 'male' ? 'blue' : 'pink'}>
                    {gender === 'male' ? '男' : '女'}
                </Tag>
            )
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance) => `¥${balance.toFixed(2)}`,
            sorter: (a, b) => a.balance - b.balance,
        },
        {
            title: '注册时间',
            dataIndex: 'registerTime',
            key: 'registerTime',
        },
        {
            title: '最近消费时间',
            dataIndex: 'lastConsumeTime',
            key: 'lastConsumeTime',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => showModal(record)}
                    >
                        编辑
                    </Button>

                    <Button
                        danger
                        size="small"
                    >
                        历史
                    </Button>

                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                    用户管理
                </h1>

                {/* 搜索和新增区域 */}
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

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        新增用户
                    </Button>
                </div>
            </div>

            {/* 用户表格 */}
            <Table
                columns={columns}
                dataSource={users}
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
                scroll={{ x: 1200 }}
            />

            {/* 新增/编辑用户模态框 */}
            <Modal
                title={editingUser ? '编辑用户' : '新增用户'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={closeModal}
                width={600}
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        gender: 'male'
                    }}
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="手机号"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
                        ]}
                    >
                        <Input placeholder="请输入手机号" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="性别"
                        rules={[{ required: true, message: '请选择性别' }]}
                    >
                        <Select placeholder="请选择性别">
                            <Option value="male">男</Option>
                            <Option value="female">女</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="balance"
                        label="余额"
                        rules={[{ required: true, message: '请输入余额' }]}
                    >
                        <Input placeholder="请输入余额" type="number" addonAfter="元" />
                    </Form.Item>

                    <Form.Item
                        name="registerTime"
                        label="注册时间"
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="请选择注册时间"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="lastConsumeTime"
                        label="最近消费时间"
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="请选择最近消费时间"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea placeholder="请输入备注信息" rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default User;