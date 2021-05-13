/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Table } from 'antd';
import { connect } from 'umi';

const CommonTable = (props: any) => {
  const {
    fetchParams: { type, url, extraArgs },
    formValues,
    tableProps,
    handleSort,
    dispatch,
    mode, // 设置mode为auto则使用hook方式
    run, // 设置mode为auto时需要提供的run方法
  } = props;
  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    /**
     *  sorter处理
     */
    // sorter支持多列排序，设置sorter:{ multiple: 1 } 标识多列排序（multiple数字越小，使用前端排序越优先，使用后端排序时也默认遵从此规则），设置为true标识单列排序
    let sorterResult: any[] = [];
    if (sorter && Array.isArray(sorter)) {
      // 多列排序  sorter是个数组，此处先按照优先级排序
      sorterResult = sorter.sort((a, b) => a.column.sorter.multiple - b.column.sorter.multiple);
    } else if (sorter && Object.keys(sorter).length) {
      // 单列排序  sorter是个对象
      sorterResult = [sorter];
    }
    // 取消多列或者单列排序时，也会存在一个sorter,但是order为undefined，因此过滤且不参与排序
    sorterResult = sorterResult.filter((i: any) => i.order);
    /**
     *   filters
     */
    // 使用filters进行全选时,改变传参为undefined
    const filterColumns = tableProps.columns.filter((i: any) => !!i.filters);
    const filtersResult = {};
    for (const k in filters) {
      if (filters[k]) {
        const target = filterColumns.find((i: any) => i.dataIndex === k);
        if (target.filters.length === filters[k].length) {
          filtersResult[k] = undefined;
        } else {
          filtersResult[k] = filters[k];
        }
      }
    }
    // 默认模式
    if (mode === '') {
      const params = {
        current: pagination.current,
        size: pagination.pageSize,
        ...formValues,
        ...filtersResult,
        ...handleSort(sorterResult), // 使用自定义函数处理排序字段，默认返回{}
        ...extraArgs,
      };
      dispatch({
        type,
        payload: { url, ...params },
      });
    }
    // hook模式
    if (mode === 'auto') {
      // 移除fetchParams附带的额外查询参数
      const params = {
        current: pagination.current,
        size: pagination.pageSize,
        ...formValues,
        ...filtersResult,
        ...handleSort(sorterResult), // 使用自定义函数处理排序字段，默认返回{}
      };
      run(params);
    }
  };
  return <Table onChange={onChange} {...tableProps} />;
};
CommonTable.defaultProps = {
  fetchParams: {},
  formValues: {},
  tableProps: {},
  handleSort: () => {},
  mode: '',
  run: () => {},
};
export default connect()(CommonTable);

/**
 *   fetchParams:{ type, url, extraArgs } 分页查询时必传
 *   formValues  表单的查询条件
 *   tableProps  传递给原生table的参数
 *   handleSort  排序函数 返回一个{}用于合并进查询，同时页面中需要留存一份数据用于查询以及重置
 *
 *   mode 设置mode为auto则使用hook方式(注意，此时fetchParams不必设置)
 *   run  设置mode为auto时需要提供的run方法
 */
