import React from 'react';
import { connect } from 'umi';
import Exception404 from '../pages/Exception/Exception404';
import PageLoading from '../components/PageLoading';
import GlobalContext from './GlobalContext';
import { superAdminName } from '@/utils/constant';

/**
 * 页面拦截器
 */
const getMenuPath = (array: any[], result: any[]) => {
  array.forEach((item: any) => {
    if (item.resourceType !== 3) {
      result.push(item.path);
      if (item.children?.length) {
        getMenuPath(item.children, result);
      }
    }
  });
};
const AuthorityFilter = ({ children, menuData, permissions, currentUser, location }: any) => {
  const { pathname } = location;
  const result: any[] = [];
  getMenuPath(menuData, result);
  // 无需鉴权的路径
  const extraPath = ['/', '/user/center', '/user/setting'];
  const isSuperAdmin = currentUser.accountName === superAdminName;
  if (result.concat(extraPath).includes(pathname)) {
    // 全局注入权限数据、是否是超级管理员
    return (
      <GlobalContext.Provider value={{ permissions, isSuperAdmin }}>
        {children}
      </GlobalContext.Provider>
    );
  }
  if (!result.length) {
    // 暂无权限数据，此时处于页面刷新，因此展示为loading
    return <PageLoading />;
  }
  return <Exception404 />;
};
export default connect(({ login }: any) => ({
  menuData: login.menuData,
  permissions: login.permissions,
  currentUser: login.currentUser,
}))(AuthorityFilter);
