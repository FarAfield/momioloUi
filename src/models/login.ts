import { postData } from '@/services/base';
import { Reducer, Effect,history } from 'umi';
import { message } from 'antd';
import { setToken, storageClear } from '../utils/utils';

export interface StateType {
  currentUser:object,
  menuData:object,
}
export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    update: Reducer<StateType>;
  };
}
const isSuccess = (response:any) => response.statusCode === '0';
const LoginModel: LoginModelType = {
  namespace: 'login',
  state: {
    currentUser: {},
    menuData:{},
  },
  effects: {
    *login({ payload,callback }, { call }) {
      const response = yield call(postData, Object.assign(payload,{ url:'/account/login' }));
      if(isSuccess(response)){
        message.success('🎉 🎉 🎉  登录成功！');
        setToken(response.data.token);
        history.replace('/');
      }
      if(callback) callback(response);
    },
    *logout(_, { call }) {
      const response = yield call(postData,{ url:'/account/logout'});
      if(isSuccess(response)){
        message.success('🎉 🎉 🎉  退出登录成功！');
        storageClear();
        history.replace('/user/login');
      }
    },
  },
  reducers: {
    update(state,action) {
      return {
        ...state,
        ...action.payload,
      };
    }
  },
};
export default LoginModel;
