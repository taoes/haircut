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
    Tag,
    InputNumber
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
    const [hxModalVisible, setHxModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [form] = Form.useForm();
    const [hxForm] = Form.useForm();



    // 获取用户列表
    const fetchUsers = async () => {
        setLoading(true);

        try {
            // 调用主进程中的 userDao.getUsers 方法
            const result = await window.api.getUsers(searchText, currentPage, pageSize);

            if (result) {
                setUsers(result.users || []);
                setTotal(result.total || 0);
            }
            console.log('获取用户列表成功:', result);
        } catch (error) {
            console.error('获取用户列表失败:', error);
            message.error('获取用户列表失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, searchText]);

    // 处理搜索
    const handleSearch = (value) => {
        setSearchText(value);
        setCurrentPage(1);
        fetchUsers();
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

    // 打开核销模态框
    const showHxModal = (user) => {
        setEditingUser(user);
        setHxModalVisible(true);
        hxForm.resetFields();
    };

    // 关闭模态框
    const closeHxModal = () => {
        setHxModalVisible(false);
        setEditingUser(null);
        hxForm.resetFields();
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
                console.log('更新用户', updatedUsers);
                let data = await window.api.updateUser(updatedUsers)
                console.log('更新用户完成', data);
                setUsers(updatedUsers);
                message.success('用户信息更新成功');
                closeModal();
            } else {
                const newUser = {
                    ...values,
                };
                console.log('创建用户', newUser);
                let data = await window.api.createUser(newUser)
                console.log('创建用户完成', data);
                message.success('用户添加成功');
                fetchUsers();

            }
            closeModal();
        } catch (error) {
            console.error('保存失败:', error);
        }
    };

    // 保存核销
    const handleHxSave = async () => {
        const values = await hxForm.validateFields();
        if (!editingUser) {
            message.error('用户信息缺失，无法核销');
            return;
        }
        let price = values.counts;
        if (values.type === '消费') {
            price = (price * (values.discount / 100)).toFixed(2);
        }

        Modal.confirm({
            title: '确认核销',
            content: `用户 ${editingUser.name} 本次 ${values.type} 共计 ${price}元, 请确认是否提交？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                let value = { userId: editingUser.id, ...values }
                console.log('核销信息', value);
                await window.api.createMoney(value);
                message.success('用户核销成功');
                closeHxModal();
            },
        });
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
            dataIndex: 'counts',
            key: 'counts',
            sorter: (a, b) => a.counts - b.counts,
        },
        {
            title: '会员等级',
            dataIndex: 'level',
            key: 'level',
            render: (v) => "VIP" + v
        },
        {
            title: '最近消费时间',
            dataIndex: 'last_consume_time',
            key: 'last_consume_time',
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
                        onClick={() => showHxModal(record)}
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
                cancelText="取消"
                okText="保存"
                onCancel={closeModal}

            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        gender: '男'
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
                        name="sex"
                        label="性别"
                        rules={[{ required: true, message: '请选择性别' }]}
                    >
                        <Select placeholder="请选择性别">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                            <Option value="保密">保密</Option>
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

            {/* 用户核销消费模态框 */}
            <Modal
                title="用户核销消费"
                open={hxModalVisible}
                onCancel={() => closeHxModal()}
                onOk={handleHxSave}
                cancelText="取消"
                okText="保存"
            >
                <Form
                    form={hxForm}
                    layout="vertical"
                    initialValues={{ discount: 100, type: '消费' ,remark: `${new Date().toLocaleString()} 操作变更` }}
                >
                    <Form.Item
                        name="type"
                        label="核销类型"
                        rules={[{ required: true, message: '请选择消费类型' }]}
                    >

                        <Select placeholder="请选择消费类型">
                            <Option value="消费">消费</Option>
                            <Option value="充值">充值</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="折扣"
                        rules={[{ required: true, message: '请输入折扣' }]}

                    >
                        <InputNumber placeholder="请输入折扣" min={10} max={100} step={10} style={{ width: '100%' }} disabled={hxForm.getFieldValue('type') === '充值'} />

                    </Form.Item>

                    <Form.Item
                        name="counts"
                        label="折前金额"
                        rules={[{ required: true, message: '请输入金额' }]}
                    >
                        <InputNumber min={0} step={5} style={{ width: '100%' }} placeholder="请输入折扣前的金额" />
                    </Form.Item>

                    <Form.Item
                        name="remark"
                        label="备注"
                        rules={[{ required: true, message: '请输入备注信息' }]}
                    >
                        <Input.TextArea placeholder="请输入备注信息" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default User;