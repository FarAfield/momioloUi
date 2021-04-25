import React, { useCallback } from 'react';
import { Card, Row, Col, Form, Button, Input, message } from 'antd';
import { connect } from 'umi';
import md5 from 'md5';

const FormItem = Form.Item;
const SecurityView = (props: any) => {
  const { loading, dispatch } = props;
  const [form] = Form.useForm();
  const onFinish = useCallback((values: any) => {
    const { originalPassword, newPassword } = values;
    dispatch({
      type: 'base/postData',
      payload: {
        url: '/account/updatePassword',
        originalPassword: md5(originalPassword),
        newPassword: md5(newPassword),
      },
      callback: () => {
        message.info('密码修改成功，正在退出！');
        setTimeout(() => {
          dispatch({ type: 'login/logout' });
        }, 1000);
      },
    });
  }, []);
  return (
    <Card bordered={false}>
      <Row gutter={24}>
        <Col span={14}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <FormItem
              name={'originalPassword'}
              label={'原始密码'}
              rules={[
                { required: true, message: '请输入原始密码' },
                {
                  pattern: /^[0-9A-Za-z]{6,12}$/,
                  message: '密码必须为6-12位数字和字母，区分大小写',
                },
              ]}
            >
              <Input placeholder={'请输入原始密码'} maxLength={12} allowClear />
            </FormItem>
            <FormItem
              name={'newPassword'}
              label={'新密码'}
              rules={[
                { required: true, message: '请输入新密码' },
                {
                  pattern: /^[0-9A-Za-z]{6,12}$/,
                  message: '密码必须为6-12位数字和字母，区分大小写',
                },
              ]}
            >
              <Input placeholder={'请输入新密码'} maxLength={12} allowClear />
            </FormItem>
            <FormItem
              name={'newCheckPassword'}
              label={'确认新密码'}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认输入的密码' },
                {
                  pattern: /^[0-9A-Za-z]{6,12}$/,
                  message: '密码必须为6-12位数字和字母，区分大小写',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('两次输入的密码不一致!');
                  },
                }),
              ]}
            >
              <Input placeholder={'请确认输入的密码'} allowClear maxLength={12} />
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" loading={loading}>
                更 新 密 码
              </Button>
              <span style={{ marginLeft: 12 }}>密码修改成功后，会自动注销请重新登录！</span>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
export default connect(({ loading }: any) => ({
  loading: loading.effects['base/postData'],
}))(SecurityView);
