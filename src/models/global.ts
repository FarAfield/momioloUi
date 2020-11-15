import { Reducer, Effect } from 'umi';
import proSettings from '../../config/defaultSettings';
export interface GlobalModelState {
  collapsed: boolean;
  defaultSetting:object,
}
export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    changeCollapsed: Effect;
    changeSetting:Effect;
  };
  reducers: {
    update: Reducer<GlobalModelState>;
  };
}
const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};
const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    defaultSetting:proSettings,
  },
  effects: {
    *changeCollapsed(_,{ put, select }){
      const collapsed = yield select(({ global }:any) => global.collapsed);
      yield put({
        type: 'update',
        payload: { collapsed:!collapsed },
      });
    },
    *changeSetting({ payload },{ put, select }){
      const { colorWeak, contentWidth } = payload;
      const defaultSetting = yield select(({ global }:any) => global.defaultSetting);
      if (defaultSetting.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      updateColorWeak(!!colorWeak);
      yield put({
        type: 'update',
        payload: { defaultSetting:{...defaultSetting,...payload} },
      });
    }
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

export default GlobalModel;
