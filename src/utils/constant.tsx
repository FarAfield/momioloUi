import React from 'react';
import { GithubOutlined } from '@ant-design/icons';

/**
 *  系统常量配置
 */
// 主题颜色
export const ThemeConfig = [
    '#1890ff',
    '#F5222D',
    '#FA541C',
    '#FAAD14',
    '#13C2C2',
    '#52C41A',
    '#2F54EB',
    '#722ED1',
];
// 登录页描述语
export const loginDescription = 'Momiolo 是西湖区最具影响力的 Web 设计规范';
// 版权配置
export const copyRightConfig = [
  { title:'react',href:'https://react.docschina.org/docs/getting-started.html' },
  { title: <GithubOutlined/>,href:'https://github.com/FarAfield' },
  { title:'vue',href:'https://cn.vuejs.org/v2/guide/' },
];
// 版权信息
export const copyRight = '';
// 请求状态码配置
export const requestConfig = {
  TOKEN_INVALID_ERROR:'10002',
  UNAUTHORIZED_ERROR:'10003'
};

