import React from 'react';
import { Table, Input, InputNumber } from 'antd';

const EditableTable = (props: any) => {
  const { list, columns, updateList } = props;

  const onChange = (value: any, index: number) => {
    const cloneList = [...list];
    cloneList[index]['paramValue'] = value;
    updateList(cloneList);
  };

  const transformColumns = columns.map((item: any) => {
    if (item.dataIndex === 'paramValue') {
      return {
        ...item,
        render: (text: any, record: any, index: number) => {
          if (record.paramName === 'current' || record.paramName === 'size') {
            return (
              <InputNumber
                value={text}
                min={1}
                max={100}
                precision={0}
                onChange={(v) => onChange(v, index)}
              />
            );
          }
          return (
            <Input
              value={text}
              onChange={(e) => onChange(e.target.value, index)}
              style={{ width: '50%' }}
            />
          );
        },
      };
    }
    return item;
  });
  return (
    <Table
      dataSource={list}
      columns={transformColumns}
      rowKey={(record) => `${record.paramName}`}
      pagination={false}
    />
  );
};
export default EditableTable;
