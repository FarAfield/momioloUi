import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import PageLoading from '../components/PageLoading';
import { isLogin } from '@/utils/utils';
import dayjs from 'dayjs';
import styles from './index.less';
import { connect } from 'umi';

// 获取当前时间秒数
const useCurrentTime = () => {
  const now = dayjs();
  const [time, setTime] = useState(now.unix());
  useEffect(() => {
    const flag = setInterval(() => {
      setTime((v) => v + 1);
    }, 1000);
    return () => clearInterval(flag);
  }, []);
  return time;
};
const Home = () => {
  if (!isLogin()) {
    return <PageLoading />;
  }
  const time = dayjs.unix(useCurrentTime()).format('YYYY-MM-DD HH:mm:ss');
  return (
    <Card>
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        <div className={styles.text}>{<h1>欢迎使用</h1>}</div>
        {
          false && time
        }
      </div>
    </Card>
  );
};
export default connect(({ login }: any) => ({
  currentUser: login.currentUser,
}))(Home);
