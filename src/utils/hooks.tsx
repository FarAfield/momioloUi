import { useState, useEffect, useReducer, useCallback } from 'react';

const initPageData = {
  list: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'save':
      return {
        ...state,
        ...action.payload,
      };
    case 'reset':
      return {
        ...initPageData,
      };
    default: {
      return {
        ...state,
      };
    }
  }
};
const useSearchTable = (fetchParams: any, form: any, initValues: object = {}) => {
  const [pageData, dispatch] = useReducer(reducer, initPageData);
  const [loading, setLoading] = useState(false);
  const { type, url, extraArgs } = fetchParams;
  // 初始化查询
  useEffect(() => {
    onChange();
  }, []);
  const getFormValues = useCallback(() => (form ? form.getFieldsValue() : {}), []);
  const reset = useCallback(() => {
    if (form) {
      form.resetFields(initValues);
    }
    onChange();
  }, []);
  const onChange = useCallback(({ current = 1, pageSize = 10 } = {}, filters = {}, sorter = {}) => {
    const params = {
      page: current,
      size: pageSize,
      ...filters,
      ...sorter,
      ...getFormValues(),
      ...extraArgs,
    };
    setLoading(true);
    dispatch({
      type,
      payload: { url, ...params },
      callback: (pageData: object) => {
        dispatch({ type: 'save', payload: { ...pageData } });
        setLoading(false);
      },
    });
  }, []);
  const reload = useCallback((number = 0) => {
    const { pagination } = pageData;
    switch (number) {
      case 0: {
        onChange(pagination);
        break;
      }
      case 1: {
        if ((pagination.current - 1) * pagination.pageSize + 1 === pagination.total) {
          onChange({ current: pagination.current - 1 || 1, pageSize: pagination.pageSize });
        } else {
          onChange(pagination);
        }
        break;
      }
      default:
        onChange({ current: 1, pageSize: pagination.pageSize });
    }
  }, []);

  return {
    loading,
    pageData,
    submit: onChange,
    reset,
    reload,
    onChange,
  };
};

export { useSearchTable };
