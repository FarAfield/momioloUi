import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect,Dispatch,history } from 'umi';
import { isLogin } from '@/utils/utils';

interface SecurityLayoutType {
  dispatch:Dispatch,
  loading:boolean,
  children:any,
}
const SecurityLayout = ({ dispatch, loading, children }:SecurityLayoutType) => {
  if(!isLogin() && !loading){
    history.replace('/user/login');
  }
  if(!isLogin() && loading){
    return <PageLoading/>
  }
  return children;
};
export default connect(({ login, loading }:any) => ({
  currentUser: login.currentUser,
  loading: loading.effects['login/login'],
}))(SecurityLayout)

