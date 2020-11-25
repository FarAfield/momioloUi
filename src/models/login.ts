import {getData, postData} from '@/services/base';
import { Reducer, Effect,history } from 'umi';
import { message } from 'antd';
import { setToken, storageClear } from '@/utils/utils';

export interface StateType {
  currentUser:object,
  menuData:Array<any>,
  permissions:Array<string>,
}
export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    findCurrentInfo:Effect,
    findCurrentMenu:Effect,
  };
  reducers: {
    update: Reducer<StateType>;
  };
}
const isSuccess = (response:any) => response.statusCode === '0';
const errorMessage = (response:any) => message.error(response.statusMessage);
const transferMenu = (menuData:Array<any>,parentPath:string = '') => {
  return menuData.map((item:any) => {
    if(item.resourceType === 1){
      const path = `${parentPath}/${item.resourceCode}`;
      item.path = path;
      item.name = `${item.resourceName}`;
      item.icon = `${item.resourceIcon}`;
      if(item.children && item.children.length){
        item.children = transferMenu(item.children,path)
      }
    }
    return item;
  });
};
const LoginModel: LoginModelType = {
  namespace: 'login',
  state: {
    currentUser: {},
    menuData:[],
    permissions:[],
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
      } else {
        errorMessage(response);
      }
    },
    *findCurrentInfo(_,{ call, put }){
      const response = yield call(getData,{ url:'/account/findCurrentInfo'});
      if(isSuccess(response)){
        yield put({
          type: 'update',
          payload: { currentUser:response.data },
        });
      } else {
        errorMessage(response)
      }
    },
    *findCurrentMenu({ callback },{ call, put }){
      const response = yield call(getData,{ url:'/resource/findCurrentMenu'});
      if(isSuccess(response)){
        const menuData = transferMenu(response.data.children || []);
        yield put({
          type: 'update',
          payload: { menuData },
        });
        if(callback) callback(menuData)
      } else {
        errorMessage(response);
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
