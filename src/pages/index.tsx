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

const welcomeText = (currentUser:any) => {
  const time = useCurrentTime();
  return (
    <div>
      <h1>{`你好 ${currentUser?.userName || '管理员'}`}</h1>
      <h1>欢迎使用</h1>
      <p>
        现在是
        <span>{`${dayjs.unix(time).year()}`}</span>年
        <span>{`${dayjs.unix(time).month() + 1}`}</span>月
        <span>{`${dayjs.unix(time).date()}`}</span>日<span>{`${dayjs.unix(time).hour()}`}</span>时
        <span>{`${dayjs.unix(time).minute()}`}</span>分<span>{`${dayjs.unix(time).second()}`}</span>
        秒
      </p>
    </div>
  );
};

const Home = (props:any) => {
  if (!isLogin()) {
    return <PageLoading />;
  }
  const { currentUser } = props;
  return (
    <Card>
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        {
          false && <div className={styles.text}>{welcomeText(currentUser)}</div>
        }
      </div>
    </Card>
  );
};
export default connect(({ login }: any) => ({
  currentUser: login.currentUser,
}))(Home);
