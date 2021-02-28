import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Radio, message } from 'antd';
import { changeTheme } from '@/utils/utils';
import { ThemeConfig } from '@/utils/constant';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const ThemeSetting = (props: any) => {
  const { visible, onClose, dispatch } = props;
  const [value, setValue] = useState<any>(localStorage.getItem('primaryColor') || '#1890ff');
  useEffect(() => {
    dispatch({
      type: 'global/changeSetting',
      payload: { primaryColor: localStorage.getItem('primaryColor') || '#1890ff' },
    });
    changeTheme(localStorage.getItem('primaryColor') || '#1890ff');
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
            <div
              key={index}
              style={{
                marginTop: 12,
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Radio.Button value={item.key} style={{ backgroundColor: `${item.key}` }}>
                {item.key === value ? (
                  <CheckOutlined
                    style={{ fontSize: 20, color: 'white', marginLeft: -8, marginRight: -16 }}
                  />
                ) : null}
              </Radio.Button>
            </div>
          ))}
        </Radio.Group>
        <div>
          {ThemeConfig.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                marginTop: 12,
                width: 80,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
export default connect()(ThemeSetting);
