/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useState,useEffect, useCallback } from 'react';
import { Link, connect, history } from 'umi';
import RightContent from '@/components/GlobalHeader/RightContent';
import DefaultFooter from '../components/DefaultFooter';
import AuthorityFilter from './AuthorityFilter';
import { isLogin, storageClear } from '@/utils/utils';
import logo from '../assets/logo.svg';


const BasicLayout: React.FC<any> = (props) => {
  const {
    dispatch,
    children,
    settings,
  } = props;
  const [menuData,setMenuData] = useState([]);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    if(isLogin()){
      dispatch({
        type: 'login/findCurrentInfo',
      });
      setLoading(true);
      dispatch({
        type: 'login/findCurrentMenu',
        callback:(res:any) => {
          setMenuData(res.data);
          setLoading(false);
        }
      });
    } else {
      storageClear();
      history.replace('/user/login');
    }
  }, []);
  const handleMenuCollapse = useCallback(() => {
    dispatch({
      type: 'global/changeCollapsed',
    });
  },[]);
  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => <DefaultFooter/>}
      menuDataRender={() => menuData}
      rightContentRender={() => <RightContent />}
      menu={{ loading }}
      {...props}
      {...settings}
    >
      <AuthorityFilter>
        {children}
      </AuthorityFilter>
    </ProLayout>
  );
};
export default connect(({ global,login }:any) => ({
  collapsed: global.collapsed,
  settings:global.defaultSetting,
}))(BasicLayout);
