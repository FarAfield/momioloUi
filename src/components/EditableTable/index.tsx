import React from 'react';
import { Table } from 'antd';
import EditableInput from './components/EditableInput';
import EditableTextArea from './components/EditableTextArea';
import EditableInputNumber from './components/EditableInputNumber';
import EditableSelect from './components/EditableSelect';
import EditableDatePicker from './components/EditableDatePicker';

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
            <EditableInput
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
            <EditableTextArea
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
            <EditableInputNumber
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
            <EditableSelect
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
            <EditableDatePicker
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
 *   columns
 *       title
 *       dataIndex
 *       width ?
 *       render ?  存在render时以下配置失效
 *
 *       type ？    input/inputNumber/textArea/select/datePicker
 *       selectOptions ？（select专属）
 *       keyValue ？（select专属）
 *       scopeProps ？（透传给不同类型组件的属性）
 *
 */
