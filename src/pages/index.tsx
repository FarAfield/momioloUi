import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'antd';
import PageLoading from '../components/PageLoading';
import { isLogin } from '@/utils/utils';
import dayjs from 'dayjs';
import styles from './index.less';

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

const welcomeText = () => {
  const time = useCurrentTime();
  return (
    <>
      <p>
        现在是
        <span>{`${dayjs.unix(time).year()}`}</span>年
        <span>{`${dayjs.unix(time).month() + 1}`}</span>月
        <span>{`${dayjs.unix(time).date()}`}</span>日<span>{`${dayjs.unix(time).hour()}`}</span>时
        <span>{`${dayjs.unix(time).minute()}`}</span>分<span>{`${dayjs.unix(time).second()}`}</span>
        秒
      </p>
    </>
  );
};

const Home = () => {
  if (!isLogin()) {
    return <PageLoading />;
  }
  return (
    <Card>
      <Alert message="欢迎使用,你已登录成功" type="success" style={{ marginBottom: 12 }} />
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        <div className={styles.text}>{welcomeText()}</div>
      </div>
    </Card>
  );
};
export default Home;
