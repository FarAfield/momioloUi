import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { copyRight, copyRightConfig } from '@/utils/constant';

const links = copyRightConfig.map((i: any, index: number) => {
  const item = { ...i };
  item.key = `${i.title}-${index}`;
  item.blankTarget = true;
  return item;
});
export default () => (
  <>
    <DefaultFooter copyright={`${new Date().getFullYear()} ${copyRight}`} links={links} />
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '-16px 0 8px',
        cursor: 'pointer',
      }}
      onClick={() => window.open('https://beian.miit.gov.cn/#/Integrated/index')}
    >
      鄂ICP备20014456号-1
    </div>
  </>
);
