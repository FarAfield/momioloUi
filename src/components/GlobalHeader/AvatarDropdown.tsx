import React, { useMemo, useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { connect, history } from 'umi';
import HeaderDropdown from './components/HeaderDropdown';
import styles from './index.less';
import { nickNameAndAvatar } from '@/utils/constant';

const AvatarDropdown = (props: any) => {
  const { currentUser, dispatch } = props;
  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      switch (key) {
        case 'center': {
          history.push('/user/center');
          break;
        }
        case 'settings': {
          history.push('/user/setting');
          break;
        }
        case 'logout': {
          dispatch({
            type: 'login/logout',
          });
          break
        }
        default: break

      }
    },
    [],
  );
  const menuHeaderDropdown = useMemo(
    () => (
      <Menu className={styles.menu} onClick={(e) => onMenuClick(e)}>
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
    ),
    [],
  );

  return currentUser.accountSid ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser.userAvatar || nickNameAndAvatar[1]}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>
          {currentUser.userName || nickNameAndAvatar[0]}
        </span>
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
