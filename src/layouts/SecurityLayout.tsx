import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect,Dispatch } from 'umi';
import { isLogin } from '@/utils/utils';

interface SecurityLayoutType {
  dispatch:Dispatch,
  loading:boolean,
  children:any,
}

const SecurityLayout = ({ dispatch, loading, children }:SecurityLayoutType) => {
  if(!isLogin() && loading){
    return <PageLoading/>
  }
  return children;
};
export default connect(({ login, loading }:any) => ({
  currentUser: login.currentUser,
  loading: loading.models.login,
}))(SecurityLayout)

