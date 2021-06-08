import React, { useState } from 'react';
import CommonAuth from '@/components/Momiolo/CommonAuth';
import EditableTable from './index';
import { useUpdateEffect } from 'ahooks';
import Mock from 'mockjs';

const dataSource = new Array(15).fill(1).map((item, index) => {
  return {
    sid: index,
    name: Mock.mock('@cname'),
    power: Mock.mock('@cword("12345")'),
    jade: Mock.mock('@integer(3, 5)'),
    title: Mock.mock('@csentence(4)'),
    time: Mock.mock('@date'),
    desc: Mock.mock('@cparagraph'),
  };
});

const EditableTableDemo = () => {
  const [list, setList] = useState(dataSource);

  useUpdateEffect(() => {
    console.log('list更新', list);
  }, [list]);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '10%',
      type: 'input',
    },
    {
      title: '势力',
      dataIndex: 'power',
      width: '10%',
      type: 'select',
      selectOptions: [
        { value: '1', label: '魏' },
        { value: '2', label: '蜀' },
        { value: '3', label: '吴' },
        { value: '4', label: '群' },
        { value: '5', label: '神' },
      ],
    },
    {
      title: '血量上限',
      dataIndex: 'jade',
      width: '10%',
      type: 'inputNumber',
      scopeProps: {
        min: 1,
        max: 10,
      },
    },
    {
      title: '称号',
      dataIndex: 'title',
      width: '10%',
      type: 'input',
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: '15%',
      type: 'datePicker',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: '30%',
      type: 'textArea',
    },
    {
      title: '操作',
      dataIndex: '操作',
      render: (text: any, record: any, index: number) => {
        const btns = [
          {
            key: 'edit',
            title: '重置血量',
            auth: 'system',
            onClick: () => updateList(index, 'jade', 3),
          },
          {
            key: 'remove',
            title: '删除',
            auth: 'system',
            pop: true,
            message: '是否确认删除？',
            onClick: () => setList(list.filter((_, i) => i !== index)),
          },
        ];
        return <CommonAuth btns={btns} />;
      },
    },
  ];
  const updateList = (index: number, key: any, value: any) => {
    const cloneList = [...list];
    cloneList[index][key] = value;
    setList(cloneList);
  };

  return <EditableTable list={list} columns={columns} updateList={updateList} />;
};
export default EditableTableDemo;
