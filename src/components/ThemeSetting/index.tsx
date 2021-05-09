import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Radio, message, Descriptions } from 'antd';
import { changeTheme } from '@/utils/utils';
import { ThemeConfig, proSettings } from '@/utils/constant';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const ThemeSetting = (props: any) => {
  const { visible, onClose, dispatch, proSetting } = props;
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
  const onSettingChange = (payload: any) => {
    if (payload.layout === 'side') {
      payload.contentWidth = 'Fluid';
    }
    dispatch({
      type: 'global/changeSetting',
      payload,
    });
  };
  return (
    <Drawer
      title="风格设置"
      placement="right"
      keyboard
      maskClosable
      closable={false}
      width={300}
      onClose={onClose}
      visible={visible}
    >
      <Descriptions title={'主题色设置'} />
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
      <div className={styles.setting}>
        <Descriptions title={'导航模式'} />
        <Radio.Group
          options={[
            { label: '侧边栏', value: 'side' },
            { label: '顶部', value: 'top' },
          ]}
          optionType="button"
          buttonStyle="solid"
          value={proSetting.layout}
          onChange={(e: any) => onSettingChange({ layout: e.target.value })}
        />
      </div>
      {proSetting.layout === 'top' && (
        <div className={styles.setting}>
          <Descriptions title={'内容区域宽度'} />
          <Radio.Group
            options={[
              { label: '流式', value: 'Fluid' },
              { label: '定宽', value: 'Fixed' },
            ]}
            optionType="button"
            buttonStyle="solid"
            value={proSetting.contentWidth}
            onChange={(e: any) => onSettingChange({ contentWidth: e.target.value })}
          />
        </div>
      )}
    </Drawer>
  );
};
export default connect(({ global }: any) => ({
  proSetting: global.defaultSetting,
}))(ThemeSetting);
