import { Card, Row, Col, Typography, Divider, Tag, Space } from 'antd';
import { 
  CodeOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  RocketOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

function About() {
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
        {/* 系统标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#333', marginBottom: '8px' }}>
            <RocketOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Haircut 理发店管理系统
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            专为现代理发店打造的一站式管理解决方案
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* 系统信息卡片 */}
          <Col span={24}>
            <Card 
              title={
                <Space>
                  <CodeOutlined />
                  <span>系统信息</span>
                </Space>
              }
              headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                      <Text strong>开发人员：</Text>
                      <Tag icon={<TeamOutlined />} color="blue">Tao E.S</Tag>
                    </div>
                    <div>
                      <Text strong>开发时间：</Text>
                      <Tag icon={<CalendarOutlined />} color="green">2024年3月</Tag>
                    </div>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                      <Text strong>技术栈：</Text>
                      <Space wrap>
                        <Tag color="processing">Tauri</Tag>
                        <Tag color="processing">React 19</Tag>
                        <Tag color="processing">Vite 7</Tag>
                        <Tag color="processing">Ant Design 6</Tag>
                        <Tag color="processing">Rust</Tag>
                      </Space>
                    </div>
                    <div>
                      <Text strong>部署平台：</Text>
                      <Tag color="purple">跨平台桌面应用</Tag>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 核心功能卡片 */}
          <Col span={24}>
            <Card 
              title={
                <Space>
                  <CheckCircleOutlined />
                  <span>核心功能</span>
                </Space>
              }
              headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card 
                    size="small" 
                    hoverable
                    title={
                      <Space>
                        <TeamOutlined style={{ color: '#1890ff' }} />
                        <span>用户管理</span>
                      </Space>
                    }
                    bodyStyle={{ textAlign: 'center' }}
                  >
                    <Text type="secondary">
                      完整的客户信息管理，包括基本信息、余额、消费记录等
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    size="small" 
                    hoverable
                    title={
                      <Space>
                        <HeartOutlined style={{ color: '#52c41a' }} />
                        <span>订单管理</span>
                      </Space>
                    }
                    bodyStyle={{ textAlign: 'center' }}
                  >
                    <Text type="secondary">
                      详细的消费和充值记录，实时跟踪资金流动
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    size="small" 
                    hoverable
                    title={
                      <Space>
                        <BulbOutlined style={{ color: '#faad14' }} />
                        <span>系统设置</span>
                      </Space>
                    }
                    bodyStyle={{ textAlign: 'center' }}
                  >
                    <Text type="secondary">
                      灵活的系统配置和个性化设置选项
                    </Text>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 系统价值介绍 */}
          <Col span={24}>
            <Card 
              title={
                <Space>
                  <HeartOutlined />
                  <span>系统价值与用户效益</span>
                </Space>
              }
              headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
            >
              <div style={{ lineHeight: '1.8' }}>
                <Paragraph style={{ fontSize: '16px', color: '#333' }}>
                  在当今快节奏的生活环境中，传统的理发店管理模式已经难以满足现代商业需求。
                  Haircut理发店管理系统应运而生，致力于为理发行业提供专业、高效的数字化管理解决方案。
                </Paragraph>

                <Divider orientation="left">
                  <Text strong style={{ color: '#1890ff' }}>提升运营效率</Text>
                </Divider>

                <Paragraph style={{ color: '#333' }}>
                  通过集成化的用户管理和订单追踪系统，理发店可以告别繁琐的手工记录方式。
                  系统自动记录每位客户的消费历史、余额变化和服务偏好，让店员能够快速了解客户需求，
                  提供更加个性化的服务体验。智能化的数据统计功能帮助店主实时掌握经营状况，
                  做出更加精准的商业决策。
                </Paragraph>

                <Divider orientation="left">
                  <Text strong style={{ color: '#52c41a' }}>优化客户体验</Text>
                </Divider>

                <Paragraph style={{ color: '#333' }}>
                  系统为客户提供透明的账户管理体系，余额变动实时更新，消费记录清晰可查。
                  这不仅增强了客户的信任感，也为会员制度的实施提供了技术支撑。
                  通过数据分析，店铺可以识别忠实客户群体，制定针对性的营销策略，
                  提升客户粘性和复购率。
                </Paragraph>

                <Divider orientation="left">
                  <Text strong style={{ color: '#faad14' }}>降低运营成本</Text>
                </Divider>

                <Paragraph style={{ color: '#333' }}>
                  数字化管理显著减少了人力成本和时间投入。自动化的工作流程减少了人为错误，
                  规范化的操作流程提升了整体工作效率。系统化的财务管理让每一笔收支都有据可查，
                  有效防范财务风险，为理发店的可持续发展奠定坚实基础。
                </Paragraph>

                <Divider orientation="left">
                  <Text strong style={{ color: '#722ed1' }}>未来展望</Text>
                </Divider>

                <Paragraph style={{ color: '#333' }}>
                  Haircut系统采用现代化的技术架构，具备良好的扩展性和兼容性。
                  基于Tauri框架的跨平台特性确保了系统在不同操作系统上的稳定运行，
                  而React+Ant Design的技术组合保证了优秀的用户体验。
                  我们将持续优化系统功能，为更多理发店的数字化转型贡献力量，
                  助力传统美业拥抱科技，实现跨越式发展。
                </Paragraph>

                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '24px',
                  padding: '16px',
                  backgroundColor: '#f0f2f5',
                  borderRadius: '8px'
                }}>
                  <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    让每一次剪发都成为美好的开始
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default About;