import { Reducer, Effect } from 'umi';
import proSettings from '../../config/defaultSettings';
export interface GlobalModelState {
  collapsed: boolean;
  defaultSetting: object;
  theme: string;
  breadcrumbData: Array<any>;
}
export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    changeCollapsed: Effect;
    changeSetting: Effect;
  };
  reducers: {
    update: Reducer<GlobalModelState>;
  };
}
const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    defaultSetting: proSettings,
    theme: 'default',
    breadcrumbData: [], // 面包屑数据
  },
  effects: {
    *changeCollapsed(_, { put, select }) {
      const collapsed = yield select(({ global }: any) => global.collapsed);
      yield put({
        type: 'update',
        payload: { collapsed: !collapsed },
      });
    },
    *changeSetting({ payload }, { put, select }) {
      const { contentWidth } = payload;
      const defaultSetting = yield select(({ global }: any) => global.defaultSetting);
      if (defaultSetting.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      yield put({
        type: 'update',
        payload: { defaultSetting: { ...defaultSetting, ...payload } },
      });
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

export default GlobalModel;
