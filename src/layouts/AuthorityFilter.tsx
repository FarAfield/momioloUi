import React from 'react';
import { connect } from 'umi';
import Exception403 from '../pages/Exception/Exception403';
import PageLoading from '../components/PageLoading';
import GlobalContext from './GlobalContext';

/**
 * 页面拦截器
 */
const getMenuPath = (array: Array<any>, result: Array<any>) => {
  array.forEach((item: any) => {
    if (item.resourceType !== 3) {
      result.push(item.path);
      if (item.children?.length) {
        getMenuPath(item.children, result);
      }
    }
  });
};
const AuthorityFilter = ({ children, menuData, permissions, location }: any) => {
  const { pathname } = location;
  const result: Array<any> = [];
  getMenuPath(menuData, result);
  // 无需鉴权的路径
  const extraPath = ['/', '/user/center', '/user/setting'];
  if (result.concat(extraPath).includes(pathname)) {
    // 全局注入权限数据
    return <GlobalContext.Provider value={{ permissions }}>{children}</GlobalContext.Provider>;
  } else if (!result.length) {
    // 暂无权限数据，此时处于页面刷新，因此展示为loading
    return <PageLoading />;
  } else {
    return <Exception403 />;
  }
};
export default connect(({ login }: any) => ({
  menuData: login.menuData,
  permissions: login.permissions,
}))(AuthorityFilter);
