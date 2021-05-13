/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect } from 'react';
import { isSuccess } from './utils';
import dayjs from 'dayjs';

// 获取当前时间
export const useCurrentTime = () => {
  const [time, setTime] = useState(dayjs().unix());
  useEffect(() => {
    const flag = setInterval(() => {
      setTime((v) => v + 1);
    }, 1000);
    return () => clearInterval(flag);
  }, []);
  return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss');
};

/**
 *  获取一个请求信号
 *  与请求相关联，则可以使用cancel方法取消请求
 *  例如：
 *  const [signal,cancel] = useSignal()
 *  dispatch({
 *    type:'base/getData',
 *    payload: { url:"xxx", signal }
 *  })
 *  使用cancel则可以取消掉这次请求
 */
export const useSignal = () => {
  const controller = new AbortController(); // 创建一个控制器
  const { signal } = controller; // 返回一个 AbortSignal 对象实例，它可以用来 with/abort 一个 DOM 请求
  const [value] = useState<any>(signal);
  function cancel() {
    controller.abort();
  }
  return [value, cancel];
};

/**
 *  基于table
 */
interface optionsProps {
  transformParam?: Function;
  transformResult?: Function;
  extraParams?: object;
}
export const useTableFetch = (service: any, options: optionsProps = {}) => {
  const { transformParam, transformResult, extraParams = {} } = options;
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(extraParams);
  async function run(p: any = {}) {
    const { current = 1, size = 10, ...rest } = p;
    let finalParams = { current, size, ...rest, ...extraParams };
    if (transformParam) {
      finalParams = transformParam(finalParams);
    }
    setParams(finalParams);
    setLoading(true);
    let response: any = await service(finalParams);
    setLoading(false);
    if (transformResult) {
      response = transformResult(response);
    }
    if (isSuccess(response)) {
      const { records = [], total = 0, current = 1, size = 10 } = response.data;
      setList(records);
      setCurrent(current);
      setPageSize(size);
      setTotal(total);
    }
  }
  function refresh() {
    run(params);
  }
  return {
    list,
    pagination: {
      current,
      pageSize,
      total,
    },
    loading,
    run,
    params,
    refresh,
  };
};
