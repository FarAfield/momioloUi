/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useContext } from 'react';
import { Card, Button, Input, message } from 'antd';
import GlobalContext from '@/layouts/GlobalContext';
import { useCurrentTime } from '@/utils/hooks';
import styles from './index.less';

const Home = () => {
  const [value, setValue] = useState('');
  const { socket }: any = useContext(GlobalContext);
  const time = useCurrentTime();
  const onClick = () => {
    value &&
      socket.emit('sendMsgEvent', {
        msgContent: value,
      });
  };
  socket.on('receiveMsgEvent', (data: any) => {
    message.info(data);
  });
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
      <Button onClick={onClick}>点击使用socket发送消息</Button>
    </Card>
  );
};
export default Home;
