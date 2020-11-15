import React from 'react';
import { message } from 'antd';
import { connect } from 'umi';
import { BellOutlined } from '@ant-design/icons';
import AvatarDropdown from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';


const GlobalHeaderRight: React.FC<any> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;
  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="momiolo"
        onSearch={value => {
          message.info(value);
        }}
      />
      <div style={{ margin:'0 12px' }}><BellOutlined /></div>
      <AvatarDropdown />
    </div>
  );
};

export default connect(({ global }:any) => ({
  theme: global.defaultSetting.navTheme,
  layout: global.defaultSetting.layout,
}))(GlobalHeaderRight);
