import React from 'react';
import { connect, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';

/**
 *  面包屑数据处理   global存在数据则使用global的面包屑数据，否则使用默认
 */
const PageCard = ({ children, breadcrumbData }: any) => {
  const header = {
    title: breadcrumbData?.[breadcrumbData.length - 1]?.breadcrumbName,
    breadcrumb: {
      routes: breadcrumbData,
      itemRender: (route: any, params: any, routes: any, paths: any) => {
        const first = routes.indexOf(route) === 0;
        return !first ? (
          <span>{route.breadcrumbName}</span>
        ) : (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        );
      },
    },
  };
  const pageContainerProps = breadcrumbData.length ? { header } : {};
  return (
    <PageContainer {...pageContainerProps}>
      <Card>{children}</Card>
    </PageContainer>
  );
};
export default connect(({ global }: any) => ({
  breadcrumbData: global.breadcrumbData,
}))(PageCard);
