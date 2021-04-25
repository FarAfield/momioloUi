/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-syntax */
import { ThemeConfig } from '@/utils/constant';
import moment from 'moment';

/** ===========================  Token   ================================== */
export function isLogin() {
  return !!sessionStorage.getItem('token');
}
export function setToken(token: any) {
  sessionStorage.setItem('token', token);
}
export function getToken() {
  return sessionStorage.getItem('token');
}
export function storageClear() {
  sessionStorage.clear();
}

/** ===========================  Response   ================================== */
export const isSuccess = (response: any) => {
  return response?.statusCode === '0';
};

/** ===========================  Theme   ================================== */
export const changeTheme = (primaryColor: any = '#1890ff') => {
  const linkDom: any = document.getElementById('theme-style') as HTMLLinkElement;
  if (linkDom) {
    linkDom.href = ThemeConfig.find((item: any) => item.key === primaryColor)?.theme;
  } else {
    const style: any = document.createElement('link');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.id = 'theme-style';
    style.href = ThemeConfig.find((item: any) => item.key === primaryColor)?.theme;
    if (document.body.append) {
      document.body.append(style);
    } else {
      document.body.appendChild(style);
    }
  }
};

/** =======================   异步并发限制   ============================= */
// poolLimit：并发限制  array  iteratorFn: 要执行的函数（返回promise）
export async function asyncPool(poolLimit: number, array: any[], iteratorFn: Function) {
  const ret = [];
  const executing: any[] = []; // 当前正在执行的Promise数组
  for (const item of array) {
    // 实例化promise
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);
    const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= poolLimit) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}
/** 使用方式如下 */
// 10个随机数的数组
const array = new Array(10).fill(true).map(() => {
  return Math.ceil(Math.random() * 20);
});
// 入参为数组的每一项，返回一个promise
function iteratorFn(delay: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(delay, moment().format('m分s秒'));
      resolve(delay);
    }, delay * 1000);
  });
}
// 使用异步并发，确保大量请求时线程池每次都只有2个promise在执行
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function start() {
  const results = await asyncPool(2, array, iteratorFn);
  console.log(results, '结果');
}
