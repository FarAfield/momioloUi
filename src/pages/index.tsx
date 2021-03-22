import React, { useState, useEffect } from 'react';
import { Card, Button, Input, message } from 'antd';
import dayjs from 'dayjs';
import styles from './index.less';
import { socket, createSocket, closeSocket } from '@/utils/socket';


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
  useEffect(() => {
    createSocket();
    return () => closeSocket();
  },[]);
  const [value,setValue] = useState('');
  const onClick = () => {
    socket && value &&
    socket.emit('sendMsgEvent', {
      msgContent: value,
    });
  };
  socket &&
  socket.on('receiveMsgEvent', (data: any) => {
    message.info(data);
  });
  const time = dayjs.unix(useCurrentTime()).format('YYYY-MM-DD HH:mm:ss');
  return (
    <Card>
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        <div className={styles.text}>{<h1>欢迎使用</h1>}</div>
        <div className={styles.text}>{time}</div>
      </div>
      <Input style={{ margin: '12px 0', width: '30%'}} value={value} placeholder={'请输入内容'} onChange={(e:any) => setValue(e.target.value)}/>
      <Button onClick={onClick}>点击使用socket发送消息</Button>
    </Card>
  );
};
export default Home;
