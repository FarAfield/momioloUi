import React from 'react';
import UserLayout from './UserLayout';
import BasicLayout from './BasicLayout';

interface SecurityLayoutType {
  location: any;
}
const SecurityLayout = (props: any) => {
  const { location }: SecurityLayoutType = props;
  const { pathname } = location;
  if (pathname === '/user/login') {
    return <UserLayout {...props} />;
  }
  return <BasicLayout {...props} />;
};
export default SecurityLayout;
