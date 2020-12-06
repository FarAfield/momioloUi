import React from 'react';
import { GithubOutlined } from '@ant-design/icons';

/**
 *  系统常量配置
 */
// 主题颜色
export const ThemeConfig = [
  {
    key: 'default',
    theme: '',
    name:'拂晓蓝',
    modifyVars: {
      '@primary-color': '#1890ff',
    },
  },
  {
    key: 'dust',
    theme: 'https://preview.pro.ant.design/theme/dust.css',
    name:'薄暮',
    modifyVars: {
      '@primary-color': '#F5222D',
    },
  },
  {
    key: 'volcano',
    theme: 'https://preview.pro.ant.design/theme/volcano.css',
    name:'火山',
    modifyVars: {
      '@primary-color': '#FA541C',
    },
  },
  {
    key: 'sunset',
    theme: 'https://preview.pro.ant.design/theme/sunset.css',
    name:'日暮',
    modifyVars: {
      '@primary-color': '#FAAD14',
    },
  },
  {
    key: 'cyan',
    theme: 'https://preview.pro.ant.design/theme/cyan.css',
    name:'明青',
    modifyVars: {
      '@primary-color': '#13C2C2',
    },
  },
  {
    key: 'green',
    theme: 'https://preview.pro.ant.design/theme/green.css',
    name:'极光绿',
    modifyVars: {
      '@primary-color': '#52C41A',
    },
  },
  {
    key: 'geekblue',
    theme: 'https://preview.pro.ant.design/theme/geekblue.css',
    name:'极客蓝',
    modifyVars: {
      '@primary-color': '#2F54EB',
    },
  },
  {
    key: 'purple',
    theme: 'https://preview.pro.ant.design/theme/purple.css',
    name:'酱紫',
    modifyVars: {
      '@primary-color': '#722ED1',
    },
  },
];
// 登录页描述语
export const loginDescription = 'Momiolo 是极具个性化的 Web 中台系统';
// 版权配置
export const copyRightConfig = [
  { title: '@react', href: 'https://react.docschina.org/docs/getting-started.html' },
  { title: <GithubOutlined />, href: 'https://github.com/FarAfield' },
  { title: '@vue', href: 'https://cn.vuejs.org/v2/guide/' },
];
// 版权信息
export const copyRight = '版权所有';
// 请求状态码配置
export const requestConfig = {
  TOKEN_INVALID_ERROR: '10002',
  UNAUTHORIZED_ERROR: '10003',
};
// 默认昵称以及头像配置
export const nickNameAndAvatar = [
  '管理员',
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
];
