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
  chainWebpack(memo) {
    memo.plugin('monaco-editor-webpack-plugin').use(require('monaco-editor-webpack-plugin'))
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  dynamicImport: {},
  publicPath:'/',
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  proxy: {
    '/base': {
      target: 'https://www.momiolo.com:4430/base',
      // target: 'http://localhost:8080/base',
      changeOrigin: true,
      pathRewrite: { '/base': '' },
    },
  },
});
