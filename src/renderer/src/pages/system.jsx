import { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Switch, 
  Button, 
  Space, 
  message,
  Divider,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  SettingOutlined,
  SaveOutlined,
  SyncOutlined,
  DatabaseOutlined,
  NotificationOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';

const { Title } = Typography;

function System() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // 模拟保存设置
    setTimeout(() => {
      console.log('保存的设置:', values);
      message.success('系统设置保存成功！');
      setLoading(false);
    }, 1000);
  };

  const resetSettings = () => {
    form.resetFields();
    message.info('设置已重置为默认值');
  };

  return (
    <div style={{ 
      padding: '32px 48px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#333', marginBottom: '8px' }}>
            <SettingOutlined style={{ marginRight: '12px' }} />
            系统设置
          </Title>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card 
              title={
                <Space>
                  <DatabaseOutlined />
                  <span>基础设置</span>
                </Space>
              }
              headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  shopName: 'Haircut理发店',
                  contactPhone: '400-123-4567',
                  address: '北京市朝阳区某某街道123号',
                  autoBackup: true,
                  emailNotification: false,
                  smsNotification: true
                }}
              >
                <Form.Item
                  name="shopName"
                  label="店铺名称"
                  rules={[{ required: true, message: '请输入店铺名称' }]}
                >
                  <Input placeholder="请输入店铺名称" />
                </Form.Item>

                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^[\d\-+\s()]+$/, message: '请输入正确的电话号码格式' }
                  ]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="店铺地址"
                >
                  <Input placeholder="请输入店铺详细地址" />
                </Form.Item>

                <Divider />

                <Form.Item
                  name="autoBackup"
                  label="自动备份"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>

                <Form.Item
                  name="emailNotification"
                  label="邮件通知"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>

                <Form.Item
                  name="smsNotification"
                  label="短信通知"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SaveOutlined />}
                      loading={loading}
                    >
                      保存设置
                    </Button>
                    <Button 
                      icon={<SyncOutlined />} 
                      onClick={resetSettings}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col span={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card 
                title={
                  <Space>
                    <SecurityScanOutlined />
                    <span>安全设置</span>
                  </Space>
                }
                headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
              >
                <p style={{ color: '#666' }}>密码策略设置</p>
                <p style={{ color: '#666' }}>登录失败锁定</p>
                <p style={{ color: '#666' }}>会话超时设置</p>
                <Button type="primary" block>配置安全策略</Button>
              </Card>

              <Card 
                title={
                  <Space>
                    <NotificationOutlined />
                    <span>通知设置</span>
                  </Space>
                }
                headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
              >
                <p style={{ color: '#666' }}>预约提醒配置</p>
                <p style={{ color: '#666' }}>生日祝福设置</p>
                <p style={{ color: '#666' }}>促销活动推送</p>
                <Button type="primary" block>管理通知模板</Button>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default System;