import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { copyRight, copyRightConfig } from '@/utils/constant';

const links = copyRightConfig.map((i: any) => {
  const item = { ...i };
  item.key = typeof item.title === 'string' ? item.title : 'gitlab';
  item.blankTarget = true;
  return item;
});
export default () => (
  <DefaultFooter copyright={`${new Date().getFullYear()} ${copyRight}`} links={links} />
);
