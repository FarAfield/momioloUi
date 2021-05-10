/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react';
import { Card, Input } from 'antd';
import { useCurrentTime } from '@/utils/hooks';
import styles from './index.less';

const Home = () => {
  const [value, setValue] = useState('');
  const time = useCurrentTime();
  return (
    <Card>
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        <div className={styles.text}>{<h1>欢迎使用</h1>}</div>
        <div className={styles.text}>{time}</div>
      </div>
      <Input
        style={{ margin: '12px 0', width: '30%' }}
        value={value}
        placeholder={'请输入内容'}
        onChange={(e: any) => setValue(e.target.value)}
      />
    </Card>
  );
};
export default Home;
