import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { copyRight, copyRightConfig } from '@/utils/constant';
const links = copyRightConfig.map((item, index) => {
  item['key'] = index;
  item['blankTarget'] = true;
  return item;
});
export default () => (
  <DefaultFooter copyright={`${new Date().getFullYear()} ${copyRight}`} links={links} />
);
