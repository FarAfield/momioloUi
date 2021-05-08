import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Radio, message } from 'antd';
import { changeTheme } from '@/utils/utils';
import { ThemeConfig, proSettings } from '@/utils/constant';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const ThemeSetting = (props: any) => {
  const { visible, onClose, dispatch } = props;
  const primaryColor = localStorage.getItem('primaryColor') || proSettings.primaryColor;
  const [value, setValue] = useState<any>(primaryColor);
  useEffect(() => {
    dispatch({
      type: 'global/changeSetting',
      payload: { primaryColor },
    });
    changeTheme(primaryColor);
  }, []);
  const onChange = useCallback((e) => {
    setValue(e.target.value);
    message.loading('正在加载主题...');
    dispatch({
      type: 'global/changeSetting',
      payload: { primaryColor: e.target.value },
    });
    localStorage.setItem('primaryColor', e.target.value);
    changeTheme(e.target.value);
  }, []);
  return (
    <Drawer
      title="主题设置"
      placement="right"
      keyboard
      maskClosable
      closable={false}
      width={300}
      onClose={onClose}
      visible={visible}
    >
      <div style={{ display: 'flex' }}>
        <Radio.Group value={value} onChange={onChange}>
          {ThemeConfig.map((item: any, index: number) => (
            <div key={index} className={styles.themeRadio}>
              <Radio.Button value={item.key} style={{ backgroundColor: `${item.key}` }}>
                {item.key === value ? <CheckOutlined className={styles.icon} /> : null}
              </Radio.Button>
            </div>
          ))}
        </Radio.Group>
        <div>
          {ThemeConfig.map((item: any, index: number) => (
            <div key={index} className={styles.themeName}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
export default connect()(ThemeSetting);
