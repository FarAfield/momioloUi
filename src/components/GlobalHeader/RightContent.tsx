import React from 'react';
import { connect } from 'umi';
import { message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight: React.FC<any> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;
  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      <div className={styles.other}>
        <BellOutlined onClick={() => message.info('消息通知，敬请期待!')} />
      </div>
      <AvatarDropdown />
    </div>
  );
};

export default connect(({ global }: any) => ({
  theme: global.defaultSetting.navTheme,
  layout: global.defaultSetting.layout,
}))(GlobalHeaderRight);
