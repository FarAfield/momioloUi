import {
  getData,
  postData,
  postParams,
  postList,
  putData,
  putParams,
  putList,
  remove,
  upload,
} from '@/services/base';
import { Reducer, Effect } from 'umi';
import { message } from 'antd';
import asyncDebounce from '../utils/asyncDebounce';

interface BaseModelState {
  pageUrl: string | undefined;
  pageData: {
    list: any[];
    pagination: object;
  };
  data: object;
}
interface BaseModelType {
  namespace: string;
  state: BaseModelState;
  effects: {
    getPage: Effect;
    postPage: Effect;
    getData: Effect;
    postData: Effect;
    postParams: Effect;
    postList: Effect;
    putData: Effect;
    putParams: Effect;
    putList: Effect;
    remove: Effect;
    postDataWithRes: Effect;
    getDataWithRes: Effect;
    putDataWithRes: Effect;
    removeWithRes: Effect;
    upload: Effect;
    commonPostData: Effect; // 只提供给公共组件使用
    asyncGetData: Effect;
  };
  reducers: {
    update: Reducer<BaseModelState>;
  };
}
const isSuccess = (response: any) => response.statusCode === '0';
const errorMessage = (response: any) =>
  response.statusMessage && message.error(response.statusMessage);
const BaseModel: BaseModelType = {
  namespace: 'base',
  state: {
    pageUrl: undefined,
    pageData: {
      list: [],
      pagination: {},
    },
    data: {},
  },
  effects: {
    /**
     *   get分页查询
     */
    *getPage({ payload, callback }, { call, put, select }) {
      const { url }: any = payload;
      const pageUrl = yield select(({ base }: any) => base.pageUrl);
      if (url !== pageUrl) {
        yield put({
          type: 'update',
          payload: { pageUrl: url, pageData: { list: [], pagination: {} } },
        });
      }
      // 开启异步校验
      const isValid = asyncDebounce('baseGetPage');
      const response = yield call(getData, payload);
      if (isValid()) {
        if (isSuccess(response)) {
          const { records = [], total = 0, current = 1, size = 10 } = response.data;
          const pageData = {
            list: records,
            pagination: {
              current,
              pageSize: size,
              total,
            },
          };
          yield put({ type: 'update', payload: { pageData } });
          if (callback) callback(response);
        } else {
          // 如果出错了则不清空数据，继续沿用之前数据
          const pageData = yield select(({ base }: any) => base.pageData);
          yield put({ type: 'update', payload: { pageData } });
          errorMessage(response);
        }
      }
    },
    /**
     *   post分页查询
     */
    *postPage({ payload, callback }, { call, put, select }) {
      const { url }: any = payload;
      const pageUrl = yield select(({ base }: any) => base.pageUrl);
      if (url !== pageUrl) {
        yield put({
          type: 'update',
          payload: { pageUrl: url, pageData: { list: [], pagination: {} } },
        });
      }
      // 开启异步校验
      const isValid = asyncDebounce('basePostPage');
      const response = yield call(postData, payload);
      if (isValid()) {
        if (isSuccess(response)) {
          const { records = [], total = 0, current = 1, size = 10 } = response.data;
          const pageData = {
            list: records,
            pagination: {
              current,
              pageSize: size,
              total,
            },
          };
          yield put({ type: 'update', payload: { pageData } });
          if (callback) callback(response);
        } else {
          // 如果出错了则不清空数据，继续沿用之前数据
          const pageData = yield select(({ base }: any) => base.pageData);
          yield put({ type: 'update', payload: { pageData } });
          errorMessage(response);
        }
      }
    },
    /**
     *  getData
     */
    *getData({ payload, callback }, { call, put }) {
      const response = yield call(getData, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  postData
     */
    *postData({ payload, callback }, { call, put }) {
      const response = yield call(postData, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  postParams
     */
    *postParams({ payload, callback }, { call, put }) {
      const response = yield call(postParams, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  postList
     */
    *postList({ payload, callback }, { call, put }) {
      const response = yield call(postList, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  putData
     */
    *putData({ payload, callback }, { call, put }) {
      const response = yield call(putData, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  putParams
     */
    *putParams({ payload, callback }, { call, put }) {
      const response = yield call(putParams, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  putList
     */
    *putList({ payload, callback }, { call, put }) {
      const response = yield call(putList, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  remove
     */
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },

    /** ================  以下的方法会直接返回response,当不论结果都需要使用回调函数时使用    ============================ */

    /**
     *  get方法不论结果都使用回调
     */
    *getDataWithRes({ payload, callback }, { call, put }) {
      const response = yield call(getData, payload);
      yield put({ type: 'update', payload: { data: response } });
      callback(response);
    },
    /**
     *  post方法不论结果都使用回调
     */
    *postDataWithRes({ payload, callback }, { call, put }) {
      const response = yield call(postData, payload);
      yield put({ type: 'update', payload: { data: response } });
      callback(response);
    },
    /**
     *  put方法不论结果都使用回调
     */
    *putDataWithRes({ payload, callback }, { call, put }) {
      const response = yield call(putData, payload);
      yield put({ type: 'update', payload: { data: response } });
      callback(response);
    },
    /**
     *  delete方法不论结果都使用回调
     */
    *removeWithRes({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      yield put({ type: 'update', payload: { data: response } });
      callback(response);
    },

    /**
     *  upload方法 payload包含两个参数   url  file
     */
    *upload({ payload, callback }, { call, put }) {
      const response = yield call(upload, payload);
      yield put({ type: 'update', payload: { data: response } });
      callback(response);
    },

    /** ================   只提供给公共组件使用  ==================== */

    *commonPostData({ payload, callback }, { call, put }) {
      const response = yield call(postData, payload);
      if (isSuccess(response)) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
      } else {
        errorMessage(response);
      }
    },

    /** ================================  异步防抖  =================================== */
    /**
     *  对于同一个请求路径，例如请求1响应时间5s,请求2响应时间1s。那么在执行callback时会造成数据覆盖
     *  使用异步防抖方式，可以实现每次callback时拿到的永远是最新一次请求的数据
     *  目前仅实现get请求获取数据的方式
     */
    /**
     *  asyncGetData
     */
    *asyncGetData({ payload, callback }, { call, put }) {
      const { url } = payload;
      const isValid = asyncDebounce(url);
      const response = yield call(getData, payload);
      if (isValid()) {
        yield put({ type: 'update', payload: { data: response } });
        if (callback) callback(response);
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
export default BaseModel;
