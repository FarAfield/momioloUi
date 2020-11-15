import {
  UserOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, Form, Checkbox, Input, Button } from 'antd';
import React, { useState } from 'react';
import { connect, Dispatch, Link } from 'umi';
import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  loading?: boolean;
}
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginTop: -12,
      marginBottom: 12,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const Login: React.FC<LoginProps> = (props) => {
  const { loading } = props;
  // success  loginError  captchaError
  const [status, setStatus] = useState('success');
  const onFinish = (values:object) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
      callback:({ statusCode }:any) => {
        if(statusCode && statusCode !== '0'){
          setStatus('loginError');
          setTimeout(() => setStatus('success'),3000);
        }
      }
    });
  };
  return (
    <div className={styles.main}>
      <Form
        onFinish={onFinish}
      >
        <Form.Item name="accountName" rules={[{ required: true, message: '请输入登录账号！'}]}>
          <Input
            size="large"
            prefix={<UserOutlined className={styles.prefixIcon}/>}
            placeholder="请输入登录账号"
            maxLength={20}
          />
        </Form.Item>
        <Form.Item name="accountPassword" rules={[{ required: true, message: '请输入登录密码！'}]}>
          <Input
            size="large"
            prefix={<LockOutlined className={styles.prefixIcon} />}
            type="password"
            maxLength={20}
            placeholder="请输入登录密码"
          />
        </Form.Item>
        {status === 'loginError' && !loading && (
            <LoginMessage content='账户或密码错误'/>
        )}
        <Form.Item>
          <Button
            size="large"
            type="primary"
            loading={loading}
            style={{ width: "100%"}}
            htmlType="submit"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <div>
        <Checkbox disabled>
          自动登录
        </Checkbox>
        <Link to="/user/login" style={{ float:'right'}}>忘记密码</Link>
      </div>
      <Space className={styles.other}>
        <span>其他登录方式</span>
        <AlipayCircleOutlined className={styles.icon} />
        <TaobaoCircleOutlined className={styles.icon} />
        <WeiboCircleOutlined className={styles.icon} />
        <Link to="/user/login" className={styles.register}>注册账户</Link>
      </Space>
    </div>
  );
};
export default connect(({ loading }:any) => ({
  loading: loading.effects['login/login'],
}))(Login);
