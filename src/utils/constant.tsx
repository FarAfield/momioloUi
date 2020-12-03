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
    modifyVars: {
      '@primary-color': '#1890ff',
    },
  },
  {
    key: 'dust',
    theme: 'https://preview.pro.ant.design/theme/dust.css',
    modifyVars: {
      '@primary-color': '#F5222D',
    },
  },
  {
    key: 'volcano',
    theme: 'https://preview.pro.ant.design/theme/volcano.css',
    modifyVars: {
      '@primary-color': '#FA541C',
    },
  },
  {
    key: 'sunset',
    theme: 'https://preview.pro.ant.design/theme/sunset.css',
    modifyVars: {
      '@primary-color': '#FAAD14',
    },
  },
  {
    key: 'cyan',
    theme: 'https://preview.pro.ant.design/theme/cyan.css',
    modifyVars: {
      '@primary-color': '#13C2C2',
    },
  },
  {
    key: 'green',
    theme: 'https://preview.pro.ant.design/theme/green.css',
    modifyVars: {
      '@primary-color': '#52C41A',
    },
  },
  {
    key: 'geekblue',
    theme: 'https://preview.pro.ant.design/theme/geekblue.css',
    modifyVars: {
      '@primary-color': '#2F54EB',
    },
  },
  {
    key: 'purple',
    theme: 'https://preview.pro.ant.design/theme/purple.css',
    modifyVars: {
      '@primary-color': '#722ED1',
    },
  },
];
// 登录页描述语
export const loginDescription = 'Momiolo 是西湖区最具影响力的 Web 设计规范';
// 版权配置
export const copyRightConfig = [
  { title: 'react', href: 'https://react.docschina.org/docs/getting-started.html' },
  { title: <GithubOutlined />, href: 'https://github.com/FarAfield' },
  { title: 'vue', href: 'https://cn.vuejs.org/v2/guide/' },
];
// 版权信息
export const copyRight = '';
// 请求状态码配置
export const requestConfig = {
  TOKEN_INVALID_ERROR: '10002',
  UNAUTHORIZED_ERROR: '10003',
};
// 默认昵称以及头像配置
export const nickNameAndAvatar = [
  '昵称',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606642390996&di=c281189456e8cdcc00c29f00d59e4aa7&imgtype=0&src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-a187b949aadf6ccffd0436bd346ca9ad_hd.jpg',
];
