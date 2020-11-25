// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  targets: {
    ie: 11,
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  publicPath:'/',
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  proxy: {
    '/base': {
      // target: 'http://119.45.119.55:8089/base',
      target: 'http://localhost:8080/base',
      changeOrigin: true,
      pathRewrite: { '/base': '' },
    },
  },
});
