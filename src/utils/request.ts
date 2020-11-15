/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { getToken,storageClear } from '@/utils/utils';
import { history } from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    // const { status, url } = response;
    // todo
    message.error(errorText);
  } else if (!response) {
    message.error('您的网络发生异常，无法连接服务器');
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  useCache:true, // 是否使用缓存
  prefix:'/api'
});
request.interceptors.request.use((url:string, options:any) => {
  const token = getToken();
  return (
      {
        // url: `${window['host']['url']}${url}`,
        url:`http://${window.location.host}${url}`,
        options: {
          ...options,
          headers: token ? { Authorization: `${token}` } : {},
          interceptors: true
        },
      }
  );
});
request.interceptors.response.use(async (response) => {
  if(response.status === 200){
    const data = await response.clone().json();
    if(data && data.statusCode) {
      if(data.statusCode === "9002"){
        const maxCountMessage = message;
        maxCountMessage.config({ maxCount: 1 });
        maxCountMessage.error("登陆已失效，请重新登陆");
        storageClear();
        history.replace("/user/login");
      } else if(data.statusCode === "9003"){
        history.replace("/Exception/Exception403")
      } else if(data.statusCode !== "0"){
        message.error(data.statusMessage)
      }
    }
  }
  return response;
});

export default request;
