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
 *  要确保每次请求都是不同的signal
 *  例如：
 *  const { signal,cancel } = createSignal()
 *  dispatch({
 *    type:'base/getData',
 *    payload: { url:"xxx", signal }
 *  })
 *  使用cancel则可以取消掉这次请求
 */
export const createSignal = () => {
  const controller = new AbortController(); // 创建一个控制器
  const { signal } = controller; // 返回一个 AbortSignal 对象实例，它可以用来 with/abort 一个 DOM 请求
  function cancel() {
    controller.abort();
  }
  return { signal, cancel };
};

/**
 *  基于table
 *  options: 均非必传
 *     transformParam  入参转换函数
 *     transformResult  出参转换函数
 *     extraParams  额外附加的参数（run查询每次都会附加）
 *
 *  @return
 *     list
 *     pagination
 *     loading
 *     run 执行函数
 *     params 执行函数此次执行时的参数
 *     refresh 以原参数再次执行run
 *     cancel  取消此次请求
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
  const [params, setParams] = useState({});
  const { signal, cancel } = createSignal();
  async function run(p: any = {}) {
    const { current = 1, size = 10, ...rest } = p;
    let finalParams = { current, size, ...rest, ...extraParams };
    if (transformParam) {
      finalParams = transformParam(finalParams);
    }
    setParams(finalParams);
    setLoading(true);
    let response: any = await service({ signal, ...finalParams });
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
    cancel,
  };
};

export const useControlledProps = (props: any) => {
  const { defaultValue, value, onChange = () => {} } = props;
  const [stateValue, setStateValue] = useState(value === undefined ? defaultValue : value);
  function onStateValueChange(v: any) {
    onChange(v);
    if (value === undefined) {
      setStateValue(v);
    }
  }
  return { value: value === undefined ? stateValue : value, onChange: onStateValueChange };
};

/**
 *  便捷的使用 async/await
 *  1.使用createService创建请求   const service = createService('xxx/xxx')
 *  2.封装查询方法 async function search(p) {}
 *  3.方法体内部使用transformResult直接转换结果  const data = await transformResult(service(p)) || {}
 *  4.拿到数据后自行处理（可指定数据获取失败的默认值）
 */
export const transformResult = (response: any) => {
  const { statusCode, data }: any = response || {};
  if (statusCode === '0') {
    return data;
  }
  return null;
};
