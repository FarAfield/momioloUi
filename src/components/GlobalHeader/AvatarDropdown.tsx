import React,{ useMemo, useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = (props:any) => {
  const { currentUser, dispatch } = props;
  const menuHeaderDropdown = useMemo(() =>(
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
   ),[]);
  const onMenuClick = useCallback((event:{
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    switch (key) {
      case 'center':{
        return;
      }
      case 'settings':{
        return;
      }
      case 'logout': {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      default: return;
    }
  },[]);
  return currentUser && currentUser.accountSid ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.userAvatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.userName}</span>
        </span>
      </HeaderDropdown>
  ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
  );
};
export default connect(({ login }: any) => ({
  currentUser: login.currentUser,
}))(AvatarDropdown);
