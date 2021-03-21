import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import dayjs from 'dayjs';
import styles from './index.less';
import Test from './Test';






// 是否开启首页测试
const IS_TEST = false;

















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
  const time = dayjs.unix(useCurrentTime()).format('YYYY-MM-DD HH:mm:ss');
  return (
    <>
      {IS_TEST ? (
        <Test />
      ) : (
        <Card>
          <div className={styles.sunAnimation}>
            <div className={styles.sun} />
            <div className={styles.text}>{<h1>欢迎使用</h1>}</div>
            <div className={styles.text}>{time}</div>
          </div>
        </Card>
      )}
    </>
  );
};
export default Home;
