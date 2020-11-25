import React,{ useCallback } from 'react';
import { Table } from 'antd';
import { connect } from 'umi';

const CommonTable = (props:any) => {
  const { fetchParams:{ type, url, extraArgs }, formValues, tableProps, dispatch } = props;
  const onChange = useCallback( (pagination, filters, sorter,extra) => {
    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
      ...extraArgs,
    };
    dispatch({
      type,
      payload: { url, ...params },
    });
  },[]);
  return (
      <Table
        onChange={onChange}
        {...tableProps}
      />
  )
};
CommonTable.defaultProps = {
  fetchParams:{},
  formValues:{},
  tableProps:{},
};
export default connect()(CommonTable);

/**
 *   fetchParams:{ type, url, extraArgs } 分页查询时必传
 *   formValues  表单的查询条件
 *   tableProps  传递给原生table的参数
 */
