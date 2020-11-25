import { getData,postData,postParams,postList,putData,putParams,putList,remove } from '@/services/base';
import { Reducer,Effect } from 'umi';
import { message } from 'antd';
interface BaseModelState {
  pageUrl: string | undefined;
  pageData: {
    list:Array<any>,
    pagination:object,
  };
  data:object;
}
interface BaseModelType {
  namespace: string;
  state: BaseModelState;
  effects: {
    getPage:Effect,
    postPage:Effect,
    getData:Effect,
    postData:Effect,
    postParams:Effect,
    postList:Effect,
    putData:Effect,
    putParams:Effect,
    putList:Effect,
    remove:Effect,
    postDataWithRes:Effect,
    getDataWithRes:Effect
    putDataWithRes:Effect,
    removeWithRes:Effect,
  };
  reducers: {
    update: Reducer<BaseModelState>;
  };
}
const isSuccess = (response:any) => response.statusCode === '0';
const errorMessage = (response:any) => message.error(response.statusMessage);
const BaseModel: BaseModelType  = {
  namespace: "base",
  state: {
    pageUrl: undefined,
    pageData: {
      list:[],
      pagination: {},
    },
    data: {},
  },
  effects: {
    /**
     *   get分页查询
     */
    *getPage({ payload, callback },{ call, put, select }) {
      const { url }:any = payload;
      const pageUrl = yield select(({ base }:any) => base.pageUrl);
      if(url !== pageUrl){
        yield put({ type: 'update', payload: { pageUrl: url,pageData: {  list:[], pagination: {} } }});
      }
      const response = yield call(getData, payload);
      if(isSuccess(response)){
        const { records = [], total = 0, current = 1, size = 10 } = response.data;
        const pageData = {
          list: records,
          pagination: {
            current,
            pageSize:size,
            total
          }
        };
        yield put({ type: 'update', payload: { pageData }});
        if(callback) callback(response);
      } else {
        // 如果出错了则不清空数据，继续沿用之前数据
        const pageData = yield select(({ base }:any) => base.pageData);
        yield put({ type: 'update', payload: { pageData }});
        errorMessage(response);
      }
    },
    /**
     *   post分页查询
     */
    *postPage({ payload, callback },{ call, put, select }) {
      const { url }:any = payload;
      const pageUrl = yield select(({ base }:any) => base.pageUrl);
      if(url !== pageUrl){
        yield put({ type: 'update', payload: { pageUrl: url,pageData: {  list:[], pagination: {} } }});
      }
      const response = yield call(postData, payload);
      if(isSuccess(response)){
        const { records = [], total = 0, current = 1, size = 10 } = response.data;
        const pageData = {
          list: records,
          pagination: {
            current,
            pageSize:size,
            total
          }
        };
        yield put({ type: 'update', payload: { pageData }});
        if(callback) callback(response);
      } else {
        // 如果出错了则不清空数据，继续沿用之前数据
        const pageData = yield select(({ base }:any) => base.pageData);
        yield put({ type: 'update', payload: { pageData }});
        errorMessage(response);
      }
    },
    /**
     *  getData
     */
    *getData({ payload, callback },{ call, put }) {
      const response = yield call(getData, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  postData
     */
    *postData({ payload, callback }, { call, put }) {
      const response = yield call(postData, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  postParams
     */
    *postParams({ payload, callback }, { call, put }) {
      const response = yield call(postParams, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  postList
     */
    *postList({ payload, callback }, { call, put }) {
      const response = yield call(postList, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  putData
     */
    *putData({ payload, callback }, { call, put }) {
      const response = yield call(putData, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  putParams
     */
    *putParams({ payload, callback }, { call, put }) {
      const response = yield call(putParams, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  putList
     */
    *putList({ payload, callback }, { call, put }) {
      const response = yield call(putList, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },
    /**
     *  remove
     */
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if(isSuccess(response)){
        yield put({ type: 'update', payload: { data : response }});
        if(callback) callback(response);
      } else {
        errorMessage(response);
      }
    },


    /**================  以下的方法会直接返回response,当不论结果都需要使用回调函数时使用    ============================*/



    /**
     *  get方法不论结果都使用回调
     */
    *getDataWithRes({ payload, callback },{ call, put }) {
      const response = yield call(getData, payload);
      yield put({ type: 'update', payload: { data : response }});
      callback(response);
    },
    /**
     *  post方法不论结果都使用回调
     */
    *postDataWithRes({ payload, callback },{ call, put }) {
      const response = yield call(postData, payload);
      yield put({ type: 'update', payload: { data : response }});
      callback(response);
    },
    /**
     *  put方法不论结果都使用回调
     */
    *putDataWithRes({ payload, callback },{ call, put }) {
      const response = yield call(putData, payload);
      yield put({ type: 'update', payload: { data : response }});
      callback(response);
    },
    /**
     *  delete方法不论结果都使用回调
     */
    *removeWithRes({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      yield put({ type: 'update', payload: { data : response }});
      callback(response);
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
export default BaseModel;
