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

const levelOptionOfVip = [];

for (let index = 1; index < 10; index++) {
    levelOptionOfVip.push({
        label: `VIP${index}`,
        value: index
    });

}
const levelOptions = [{
    label: '普通',
    value: '0'
}, ...levelOptionOfVip]




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
    const fetchUsers = async () => {
        setLoading(true);
        
        console.log(window.electronAPI);
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
            title: '卡号/手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex'
        },
        {
            title: '余额(元)',
            dataIndex: 'countValue',
            key: 'countValue',
            sorter: (a, b) => a.countValue - b.countValue,
        },
        {
            title: '会员等级',
            dataIndex: 'level',
            key: 'level',
            render: (v) => "VIP"+v
        },
        {
            title: '最近消费时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
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
            width: 250,
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
                        type='default'
                        size="small"
                    >
                        核销
                    </Button>

                    <Button
                        danger
                        size="small"
                    >
                        记录
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
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="卡号"
                        rules={[
                            { required: true, message: '请输入11位卡号' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入11位卡号' }
                        ]}
                    >
                        <Input placeholder="请输入11位卡号" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="性别"
                        rules={[{ required: true, message: '请选择性别' }]}
                    >
                        <Select placeholder="请选择性别">
                            <Option value="male">男</Option>
                            <Option value="female">女</Option>
                            <Option value="female">保密</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="等级"
                        rules={[{ required: true, message: '请选择用户等级' }]}
                    >
                        <Select placeholder="请选择用户等级" options={levelOptions}>
                        </Select>
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