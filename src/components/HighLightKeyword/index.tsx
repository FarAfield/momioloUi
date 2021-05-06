import React from 'react';

/**
 *   关键词高亮组件（多关键词高亮）
 *   config  Array []
 *           keyword  要高亮的关键词
 *           color 高亮的颜色
 *           markRender  自定义高亮方法  默认 (keyword:string) => keyword
 *   children  高亮的文字内容(必须是文字)
 */
const HighLightKeyword = (props: any) => {
  const { config, children } = props;
  if (typeof children === 'string') {
    let result = `${children}`;
    // 通过配置进行转换
    config.forEach((item: any) => {
      const { keyword, color, markRender } = item;
      const Reg = new RegExp(keyword, 'i');
      if (markRender) {
        result = result.replace(Reg, `${markRender(keyword)}`);
      } else {
        result = result.replace(Reg, `<span style="color:${color}">${keyword}</span>`);
      }
    });
    // @ts-ignore
    return <div dangerouslySetInnerHTML={{ __html: result }} />;
  }
  return <>{children}</>;
};
HighLightKeyword.defaultProps = {
  config: [{ keyword: 'momiolo', color: 'red', markRender: (k: string) => k }],
};

export default HighLightKeyword;
