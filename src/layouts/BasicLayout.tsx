/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, connect, history } from 'umi';
import RightContent from '@/components/GlobalHeader/RightContent';
import AuthorityFilter from './AuthorityFilter';
import { isLogin, storageClear } from '@/utils/utils';
import { getIconByName } from '@/utils/support';
import logo from '../assets/logo-white.svg';
import ThemeSetting from '../components/ThemeSetting';
import { SettingOutlined } from '@ant-design/icons';
import styles from './BasicLayout.less';

const BasicLayout: React.FC<any> = (props) => {
  const { dispatch, children, settings } = props;
  const [menuData, setMenuData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isLogin()) {
      dispatch({
        type: 'login/findCurrentInfo',
      });
      setLoading(true);
      dispatch({
        type: 'login/findCurrentMenu',
        callback: (menuData: Array<any>) => {
          setMenuData(menuData);
          setLoading(false);
        },
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
  }, []);
  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        return (
          <Link to={menuItemProps.path || '/'}>
            {getIconByName(menuItemProps.resourceIcon)}
            {defaultDom}
          </Link>
        );
      }}
      subMenuItemRender={(menuItemProps, defaultDom) => {
        return (
          <div>
            {getIconByName(menuItemProps.resourceIcon)}
            {defaultDom}
          </div>
        );
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
      footerRender={false}
      menuDataRender={() => menuData}
      rightContentRender={() => <RightContent />}
      menu={{ loading }}
      {...props}
      {...settings}
    >
      <AuthorityFilter>{children}</AuthorityFilter>
      <ThemeSetting visible={visible} onClose={() => setVisible(false)} />
      <div className={styles.themeSetting} onClick={() => setVisible(true)}>
        <SettingOutlined style={{ fontSize: 20, color: 'white' }} />
      </div>
    </ProLayout>
  );
};
export default connect(({ global }: any) => ({
  collapsed: global.collapsed,
  settings: global.defaultSetting,
}))(BasicLayout);
