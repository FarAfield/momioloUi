import React from 'react';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Typography, Alert } from 'antd';

export default () => (
    <Card>
      <Alert
        message="欢迎使用"
        type="success"
        showIcon
        banner
        style={{
          marginLeft: -10,
          marginRight: -10,
          marginTop: -12,
          marginBottom: 48,
        }}
      />
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        <SmileTwoTone /> 欢迎使用{' '}
        <HeartTwoTone twoToneColor="#eb2f96" /> You
      </Typography.Title>
    </Card>
);
