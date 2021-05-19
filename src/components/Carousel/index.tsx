import React, { useRef } from 'react';
import Slider from 'react-slick';
import styles from './index.less';

/**
 * 更加详细的文档  https://react-slick.neostack.com/docs/get-started
 */

const Carousel = ({ mode = '', className, style, setting, children }: any) => {
  const slider = useRef(null);
  function beforeChange(oldIndex: number, newIndex: number) {
    // console.log(oldIndex, 'beforeChange', newIndex);
  }
  function afterChange(index: number) {
    // console.log(index, 'afterChange');
  }
  let finalSetting: any = getSettingByMode(mode);
  finalSetting = {
    ...finalSetting,
    // 附加样式
    className: styles.root,
    beforeChange,
    afterChange,
    ...setting,
  };

  // 组件内部方法，通过ref去调用
  // slickGoTo:null, //  index, dontAnimate(动画效果 true/false)
  // slickNext:null,
  // slickPause:null,
  // slickPlay:null,
  // slickPrev:null,
  return (
    <div className={className} style={style}>
      <Slider ref={slider} {...finalSetting}>
        {children}
      </Slider>
    </div>
  );
};
Carousel.defaultProps = {
  mode: 'auto',
};
export default Carousel;

function getSettingByMode(mode: string) {
  let defaultSetting = {};
  switch (mode) {
    case 'simple': {
      defaultSetting = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
      break;
    }
    case 'multiple': {
      defaultSetting = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
      };
      break;
    }
    case 'center': {
      defaultSetting = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '60px',
      };
      break;
    }
    case 'lazy': {
      defaultSetting = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: true,
        initialSlide: 0,
      };
      break;
    }
    case 'auto': {
      defaultSetting = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: 'linear',
        pauseOnHover: true,
      };
      break;
    }
    default:
      break;
  }
  return defaultSetting;
}
/**
 *  dots: true  启用点
 *  arrows: true  启用箭头
 *
 *  infinite: true  无限循环
 *  speed: 500   滑动时动画时间
 *  slidesToScroll: 1  每次可滑动多少张
 *  slidesToShow: 1  主区域展示多少张
 *
 *  adaptiveHeight: false   自适应高度
 *  vertical: false  垂直展示
 *
 *
 *  centerMode: false   中心模式
 *  centerPadding: '60px'   中心模式下间距
 *
 *  lazyLoad: true  懒加载模式
 *  initialSlide: 0  懒加载模式指定初始值
 *
 *   autoplay: false   自动播放模式
 *   autoplaySpeed: 3000  自动播放间隔
 */
