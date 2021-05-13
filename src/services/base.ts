import request from '@/utils/request';

interface Payload {
  url: string;
  signal?: any;
  params?: object;
  list?: any[];
  file?: any;
}
/**
 *   get方法
 */
export async function getData({ url, signal, ...params }: Payload) {
  return request.get(`${url}`, {
    signal,
    params,
  });
}
/**
 *  post方法
 */
export async function postData({ url, signal, ...params }: Payload) {
  return request.post(`${url}`, {
    signal,
    data: params,
  });
}
/**
 *  post方法
 */
export async function postParams({ url, signal, ...params }: Payload) {
  return request.post(`${url}`, {
    signal,
    params,
  });
}
/**
 *  post方法
 */
export async function postList({ url, signal, list }: Payload) {
  return request.post(`${url}`, {
    signal,
    data: list,
  });
}
/**
 *  put方法
 */
export async function putData({ url, signal, ...params }: Payload) {
  return request.put(`${url}`, {
    signal,
    data: params,
  });
}
/**
 *  put方法
 */
export async function putParams({ url, signal, ...params }: Payload) {
  return request.put(`${url}`, {
    signal,
    params,
  });
}
/**
 *  put方法
 */
export async function putList({ url, signal, list }: Payload) {
  return request.put(`${url}`, {
    signal,
    data: list,
  });
}
/**
 *  delete方法
 */
export async function remove({ url, signal, ...params }: Payload) {
  return request.delete(`${url}`, { signal, params });
}

/**
 *  upload方法
 */
export async function upload({ url, signal, file }: Payload) {
  return request.post(`${url}`, { signal, data: file });
}

/**
 *  构造get请求
 */
export function createGet(url: string, signal?: any) {
  return (params: object) =>
    request.get(url, {
      params,
    });
}

/**
 *  构造post请求
 */
export function createPost(url: string, signal?: any) {
  return (params: object) =>
    request.post(url, {
      data: params,
    });
}
