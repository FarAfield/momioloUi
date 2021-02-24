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
      target: 'https://www.momiolo.com:4430/base',
      changeOrigin: true,
      pathRewrite: { '/base': '' },
    },
  },
});
