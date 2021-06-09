import React from 'react';
import { Table } from 'antd';
import EditableCell from './components/EditableCell';

const EditableTable = (props: any) => {
  const { list, columns, updateList } = props;

  function update(index: number, key: any, value: any) {
    updateList(index, key, value);
  }
  const tableColumns = columns.map((item: any) => {
    if (item.render) {
      return item;
    }
    switch (item.type) {
      case 'input': {
        return {
          ...item,
          render: (text: any, record: object, index: number) => (
            <EditableCell
              type={'input'}
              value={text}
              onSave={(v: any) => update(index, item.dataIndex, v)}
              {...item.scopeProps}
            />
          ),
        };
      }
      case 'textArea': {
        return {
          ...item,
          render: (text: any, record: object, index: number) => (
            <EditableCell
              type={'textArea'}
              value={text}
              onSave={(v: any) => update(index, item.dataIndex, v)}
              {...item.scopeProps}
            />
          ),
        };
      }
      case 'inputNumber': {
        return {
          ...item,
          render: (text: any, record: object, index: number) => (
            <EditableCell
              type={'inputNumber'}
              value={text}
              onSave={(v: any) => update(index, item.dataIndex, v)}
              {...item.scopeProps}
            />
          ),
        };
      }
      case 'select': {
        return {
          ...item,
          render: (text: any, record: object, index: number) => (
            <EditableCell
              type={'select'}
              value={text}
              onSave={(v: any) => update(index, item.dataIndex, v)}
              selectOptions={item.selectOptions}
              keyValue={item.keyValue}
              {...item.scopeProps}
            />
          ),
        };
      }
      case 'datePicker': {
        return {
          ...item,
          render: (text: any, record: object, index: number) => (
            <EditableCell
              type={'datePicker'}
              value={text}
              onSave={(v: any) => update(index, item.dataIndex, v)}
              {...item.scopeProps}
            />
          ),
        };
      }
      default:
        return item;
    }
  });

  return (
    <Table
      dataSource={list}
      columns={tableColumns}
      pagination={false}
      rowKey={(record) => record.sid}
    />
  );
};
export default EditableTable;

/**
 *  list  数据源
 *
 *  columns
 *       title
 *       dataIndex
 *       width ?
 *       render ?  存在render时以下配置失效
 *
 *       type ？    input/inputNumber/textArea/select/datePicker
 *       selectOptions ？（select专属）
 *       keyValue ？（select专属）
 *       format ? （datePicker专属）
 *       scopeProps ？（透传给不同类型组件的属性）
 *
 *  updateList  更新数据源的方法 （index，key, value）=> {}
 *
 */
