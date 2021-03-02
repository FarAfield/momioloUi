import {
  UserOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, Form, Checkbox, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, Dispatch, Link, history } from 'umi';
import md5 from 'md5';
import { isLogin } from '@/utils/utils';
import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  loading?: boolean;
}
const LoginMessage: React.FC<{
  content: string | undefined;
}> = ({ content }) => (
  <Alert
    style={{
      marginTop: -12,
      marginBottom: 12,
    }}
    message={content}
    type="error"
  />
);
const Login: React.FC<LoginProps> = (props) => {
  const { loading } = props;
  const [message, setMessage] = useState(undefined);
  useEffect(() => {
    if (isLogin()) {
      history.push('/');
    }
  }, []);
  const onFinish = ({
    accountName,
    accountPassword,
  }: {
    accountName: string;
    accountPassword: string;
  }) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { accountName, accountPassword: md5(accountPassword) },
      callback: ({ statusCode, statusMessage }: any) => {
        if (statusCode && statusCode !== '0') {
          setMessage(statusMessage);
          setTimeout(() => setMessage(undefined), 3000);
        }
      },
    });
  };
  return (
    <div className={styles.main}>
      <Form onFinish={onFinish}>
        <Form.Item name="accountName" rules={[{ required: true, message: '请输入登录账号！' }]}>
          <Input
            size="large"
            prefix={<UserOutlined className={styles.prefixIcon} />}
            placeholder="请输入登录账号"
            maxLength={20}
          />
        </Form.Item>
        <Form.Item name="accountPassword" rules={[{ required: true, message: '请输入登录密码！' }]}>
          <Input
            size="large"
            prefix={<LockOutlined className={styles.prefixIcon} />}
            type="password"
            maxLength={20}
            placeholder="请输入登录密码"
          />
        </Form.Item>
        {message && !loading && <LoginMessage content={message} />}
        <Form.Item>
          <Button
            size="large"
            type="primary"
            loading={loading}
            style={{ width: '100%' }}
            htmlType="submit"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <div>
        <Checkbox disabled>自动登录</Checkbox>
        <Link to="/user/login" style={{ float: 'right' }}>
          忘记密码
        </Link>
      </div>
      <Space className={styles.other}>
        <span>其他登录方式</span>
        <AlipayCircleOutlined className={styles.icon} />
        <TaobaoCircleOutlined className={styles.icon} />
        <WeiboCircleOutlined className={styles.icon} />
        <Link to="/user/login" className={styles.register}>
          注册账户
        </Link>
      </Space>
    </div>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['login/login'],
}))(Login);
