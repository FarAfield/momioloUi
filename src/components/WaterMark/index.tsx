import React, { useEffect, useRef } from 'react';
import createWaterMark from './createWaterMark';

const WaterMark = (props: any) => {
  const { style, children, ...options } = props;
  const container = useRef(null);

  useEffect(() => {
    createWaterMark({
      container: container.current,
      ...options,
    });
  }, []);

  return (
    <div ref={container} id="watermark" style={style}>
      {children}
    </div>
  );
};
export default WaterMark;
/**
 *   style    watermark最外层组件内联样式
 *   container   容器   默认document.body
 *   width  canvas元素宽
 *   height  canvas元素高
 *   textAlign  绘制文本的对齐方式
 *   textBaseline  文本基准线
 *   font  字体大小及样式
 *   fillStyle  自定义水印的颜色
 *   content  水印内容
 *   globalAlpha  设置图形和图像透明度的值
 *   rotate  文字旋转角度
 *   zIndex  元素堆叠顺序
 *
 */
