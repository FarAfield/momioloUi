import React, { useState, useEffect } from 'react';
import styles from './index.less';

const ImageElement = (props: ImageElementProps) => {
  const { className, width, src, ratio, useAnimate, usePreview, onClick } = props;
  const [srcSource, setSrcSource] = useState(src);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSrcSource(src);
  }, [src]);

  const Preview = ({ active, ratio = 1, onCancel, children }: any = {}) => {
    if (active) {
      const wh = Math.min(window.innerWidth, window.innerHeight) - 100;
      return (
        <div className={styles['preview-active']}>
          <div className={styles['preview-mask']} onClick={onCancel}>
            <div className={styles['preview-content']}>
              <div
                style={
                  ratio > 1
                    ? {
                        width: wh,
                        height: wh / ratio,
                      }
                    : {
                        width: wh * ratio,
                        height: wh,
                      }
                }
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${styles['image-wrapper']} ${className || ''}`} style={{ width }}>
      <div className={styles['image-inner']} style={{ paddingBottom: `${100 / ratio}%` }}>
        <img
          className={`${styles['image-real']} ${useAnimate ? styles.useAnimate : ''}`}
          src={srcSource}
          alt={''}
          onClick={() => {
            if (usePreview) {
              setVisible(true);
            } else {
              onClick?.(srcSource);
            }
          }}
        />
      </div>
      <Preview active={visible} ratio={ratio} onCancel={() => setVisible(false)}>
        <div className={styles['image-inner']} style={{ paddingBottom: `${100 / ratio}%` }}>
          <img className={styles['image-real']} src={srcSource} alt={''} />
        </div>
      </Preview>
    </div>
  );
};
export default ImageElement;
ImageElement.defaultProps = {
  width: '100%',
  ratio: 1,
  useAnimate: false,
  usePreview: false,
};
interface ImageElementProps {
  className?: string; // 外层样式
  width?: string | number; // 宽度
  src: any; // 图片路径
  ratio?: any; // 宽高比
  useAnimate?: boolean; // 使用缓动效果
  usePreview?: boolean; // 使用预览（此时onClick不生效）
  onClick?: Function; // 点击事件
}
