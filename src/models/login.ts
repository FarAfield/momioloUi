import { postData } from '@/services/base';
import { Reducer, Effect,history } from 'umi';
import { message } from 'antd';

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
    *login(_, { call, put }) {
      const payload = {};
      const response = yield call(postData, payload);
      if(isSuccess(response)){
        message.success('🎉 🎉 🎉  登录成功！');
        history.push('/');
        yield put({
          type: 'update',
          payload: { currentUser:response.data },
        });
      }
    },
    *logout(_, { call }) {
      const payload = {};
      const response = yield call(postData,payload);
      if(isSuccess(response)){
        message.success('🎉 🎉 🎉  退出登录成功！');
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
