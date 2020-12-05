import React from 'react';
import { Card, Alert } from 'antd';
import PageLoading from '../components/PageLoading';
import { isLogin } from '@/utils/utils';
import dayjs from 'dayjs';
import styles from './index.less';

const welcomeText = () => {
  const now = dayjs();
  const hour = now.hour();
  let first = '';
  if (hour < 6) {
    first = '夜很深了，注意休息';
  } else if (hour < 9) {
    first = '早上好，今天又是元气满满的一天';
  } else if (hour < 12) {
    first = '上午好，今天也要加油鸭';
  } else if (hour < 14) {
    first = '中午好，吃顿美美的午餐吧';
  } else if (hour < 18) {
    first = '下午好，起来伸个懒腰吧';
  } else if (hour < 20) {
    first = '傍晚好，来一顿美味晚餐吧';
  } else if (hour < 23) {
    first = '晚上好，工作辛苦了';
  } else {
    first = '夜深了，准备入睡吧';
  }
  return first;
};

const Home = () => {
  if (!isLogin()) {
    return <PageLoading />;
  }
  return (
    <Card>
      <Alert
        message="欢迎使用,你已登录成功"
        type="success"
        showIcon
        style={{marginBottom: 12 }}
      />
      <div className={styles.sunAnimation}>
        <div className={styles.sun}/>
        <div className={styles.text}><p>{welcomeText()}</p></div>
      </div>
    </Card>
  );
};
export default Home;
