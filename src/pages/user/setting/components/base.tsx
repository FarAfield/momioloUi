import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Form, Button, Input, Radio, Avatar, message, Spin } from 'antd';
import { connect } from 'umi';
import { nickNameAndAvatar } from '@/utils/constant';

const FormItem = Form.Item;
const BaseView = (props: any) => {
  const { loading, currentUser, dispatch } = props;
  const [form] = Form.useForm();
  const [userAvatar, setUserAvatar] = useState(nickNameAndAvatar[1]);
  useEffect(() => {
    // 给昵称以及头像赋予默认值
    form.setFieldsValue({
      ...currentUser,
      userName: currentUser.userName || nickNameAndAvatar[0],
    });
    setUserAvatar(currentUser.userAvatar || nickNameAndAvatar[1]);
  }, [currentUser]);
  const onFinish = useCallback((values: any) => {
    dispatch({
      type: 'base/postData',
      payload: { url: '/account/updateCurrentInfo', ...values },
      callback: (res: any) => {
        message.success('更新设置成功');
        dispatch({ type: 'login/findCurrentInfo' });
      },
    });
  }, []);
  return (
    <Card bordered={false}>
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={14}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <FormItem
                name={'userName'}
                label={'昵称'}
                rules={[{ message: '最大字符长度8', max: 8 }]}
              >
                <Input placeholder={'请输入昵称'} allowClear />
              </FormItem>
              <FormItem
                name={'userMobile'}
                label={'手机号'}
                rules={[{ message: '请输入合法的手机号', pattern: /^1\d{10}$/ }]}
              >
                <Input placeholder={'请输入手机号'} allowClear />
              </FormItem>
              <FormItem name={'userSex'} label={'性别'}>
                <Radio.Group>
                  <Radio value={0}>男</Radio>
                  <Radio value={1}>女</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem
                name={'userMail'}
                label={'邮箱'}
                rules={[
                  {
                    message: '请输入合法的邮箱',
                    pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  },
                ]}
              >
                <Input placeholder={'请输入邮箱'} allowClear />
              </FormItem>
              <FormItem
                name={'userLocation'}
                label={'地址'}
                rules={[{ message: '最大字符长度50', max: 50 }]}
              >
                <Input placeholder={'请输入地址'} allowClear />
              </FormItem>
              <FormItem
                name={'userAvatar'}
                label={'头像链接'}
                rules={[{ message: '最大字符长度1000', max: 1000 }]}
              >
                <Input placeholder={'请输入头像链接Url'} allowClear />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  更 新 设 置
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={8} offset={2}>
            <span>头像</span>
            <div>
              <Avatar size={200} src={userAvatar} alt="avatar" />
            </div>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};
export default connect(({ loading, login }: any) => ({
  loading: loading.effects['base/postData'] || loading.effects['login/findCurrentInfo'],
  currentUser: login.currentUser,
}))(BaseView);
