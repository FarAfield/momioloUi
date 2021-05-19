import React, { useState } from 'react';
import { Radio, Switch, Space } from 'antd';
import Carousel from './index';
import styles from './CarouselDemo.less';

const Mode = [
  { key: 'simple', value: '简易模式' },
  { key: 'multiple', value: '多滑块模式' },
  { key: 'center', value: '中心模式' },
  { key: 'lazy', value: '懒加载模式' },
  { key: 'auto', value: '自动播放模式' },
];

const CarouselDemo = () => {
  const [mode, setMode] = useState('simple');
  const [showArrow, setShowArrow] = useState(true);
  const [showDots, setShowDots] = useState(true);

  return (
    <div className={styles.root}>
      <Space>
        <Switch
          checkedChildren="展示箭头"
          unCheckedChildren="关闭"
          checked={showArrow}
          onChange={(v: any) => setShowArrow(v)}
        />
        <Switch
          checkedChildren="展示点"
          unCheckedChildren="关闭"
          checked={showDots}
          onChange={(v: any) => setShowDots(v)}
        />
        <Radio.Group onChange={(e: any) => setMode(e.target.value)} value={mode}>
          {Mode.map((item: any, index: number) => {
            return (
              <Radio value={item.key} key={index}>
                {item.value}
              </Radio>
            );
          })}
        </Radio.Group>
      </Space>
      <Carousel
        key={mode === 'auto' ? '1' : '0'}
        mode={mode}
        setting={{
          dots: showDots,
          arrows: showArrow,
        }}
      >
        {new Array(18).fill(1).map((_, index: number) => {
          return (
            <div className={styles.box} key={index}>
              <div className={styles.slider}>{`这是第${index + 1}张图`}</div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
export default CarouselDemo;
