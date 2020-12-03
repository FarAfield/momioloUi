import request from '@/utils/request';
interface Payload {
  url: string;
  params?: object;
  list?: Array<any>;
}
/**
 *   get方法
 */
export async function getData({ url, ...params }: Payload) {
  return request.get(`${url}`, {
    params,
  });
}
/**
 *  post方法
 */
export async function postData({ url, ...params }: Payload) {
  return request.post(`${url}`, {
    data: params,
  });
}
/**
 *  post方法
 */
export async function postParams({ url, ...params }: Payload) {
  return request.post(`${url}`, {
    params,
  });
}
/**
 *  post方法
 */
export async function postList({ url, list }: Payload) {
  return request.post(`${url}`, {
    data: list,
  });
}
/**
 *  put方法
 */
export async function putData({ url, ...params }: Payload) {
  return request.put(`${url}`, {
    data: params,
  });
}
/**
 *  put方法
 */
export async function putParams({ url, ...params }: Payload) {
  return request.put(`${url}`, {
    params,
  });
}
/**
 *  put方法
 */
export async function putList({ url, list }: Payload) {
  return request.put(`${url}`, {
    data: list,
  });
}
/**
 *  delete方法
 */
export async function remove({ url }: Payload) {
  return request.delete(`${url}`, {});
}
