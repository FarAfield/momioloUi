/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// 获取当前时间
export const useCurrentTime = () => {
  const [time, setTime] = useState(dayjs().unix());
  useEffect(() => {
    const flag = setInterval(() => {
      setTime((v) => v + 1);
    }, 1000);
    return () => clearInterval(flag);
  }, []);
  return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss');
};
