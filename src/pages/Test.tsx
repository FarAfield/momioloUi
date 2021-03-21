import React from 'react';
import PageCard from '@/components/PageCard';
import { connect } from 'umi';

/**
 *   该页面为首页测试页面，设置为true开启
 */
const Test = (props: any) => {
  return (
    <PageCard>
      <div style={{ height: 600 }}></div>
    </PageCard>
  );
};
export default connect()(Test);
