import { getData, postData } from '@/services/base';
import { Reducer, Effect } from 'umi';
import { history } from 'umi';
import { message } from 'antd';
import { setToken, storageClear } from '@/utils/utils';
import { loginSuccessTip, logoutSuccessTip } from '@/utils/constant';

/**
 *   login 模块
 *   有关账户的全部操作此处进行逻辑处理
 */

export interface StateType {
  currentUser: object;
  menuData: any[];
  permissions: string[];
}
export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    findCurrentInfo: Effect;
    findCurrentMenu: Effect;
  };
  reducers: {
    update: Reducer<StateType>;
  };
}
const isSuccess = (response: any) => response.statusCode === '0';
const errorMessage = (response: any) =>
  response.statusMessage && message.error(response.statusMessage);
const transferMenu = (menuData: any[], parentPath: string = '') => {
  return menuData.map((i: any) => {
    const item = { ...i };
    if (item.resourceType !== 3) {
      const path = `${parentPath}/${item.resourceCode}`;
      item.path = path;
      item.name = `${item.resourceName}`;
      item.hideInMenu = item.resourceType === 2;
      // item.icon = `${item.resourceIcon}`;
      if (item.children && item.children.length) {
        item.children = transferMenu(item.children, path);
      }
    }
    return item;
  });
};
const LoginModel: LoginModelType = {
  namespace: 'login',
  state: {
    currentUser: {},
    menuData: [],
    permissions: [],
  },
  effects: {
    /**
     *  登录
     */
    *login({ payload, callback }, { call }) {
      const response = yield call(postData, Object.assign(payload, { url: '/account/login' }));
      if (isSuccess(response)) {
        loginSuccessTip && message.success(loginSuccessTip);
        setToken(response.data.token);
        history.push('/');
      }
      if (callback) callback(response);
    },
    /**
     *  退出登录
     */
    *logout(_, { call }) {
      const response = yield call(postData, { url: '/account/logout' });
      if (isSuccess(response)) {
        logoutSuccessTip && message.success(logoutSuccessTip);
        storageClear();
        history.push('/user/login');
      } else {
        errorMessage(response);
      }
    },
    /**
     *  查询当前登录用户的信息
     */
    *findCurrentInfo(_, { call, put }) {
      const response = yield call(getData, { url: '/account/findCurrentInfo' });
      if (isSuccess(response)) {
        yield put({
          type: 'update',
          payload: { currentUser: response.data, permissions: response.data?.permissions || [] },
        });
      } else {
        errorMessage(response);
      }
    },
    /**
     *  查询当前登录用户的菜单
     */
    *findCurrentMenu({ callback }, { call, put }) {
      const response = yield call(getData, { url: '/resource/findCurrentMenu' });
      if (isSuccess(response)) {
        const menuData = transferMenu(response.data.children || []);
        yield put({
          type: 'update',
          payload: { menuData },
        });
        if (callback) callback(menuData);
      } else {
        errorMessage(response);
      }
    },
  },
  reducers: {
    update(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default LoginModel;
