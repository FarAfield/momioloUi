/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { Card } from 'antd';
import { useCurrentTime } from '@/utils/hooks';
import styles from './index.less';

const Home = () => {
  const time = useCurrentTime();
  return (
    <Card>
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        <div className={styles.text}>{<h1>欢迎使用</h1>}</div>
        <div className={styles.text}>{time}</div>
      </div>
    </Card>
  );
};
export default Home;
