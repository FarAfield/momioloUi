import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
import { BankOutlined, BarsOutlined } from '@ant-design/icons';

export const transferOption = (arrayData = [], keyValue = ['value', 'label']) =>
  arrayData.map((item) => (
    <Option key={item[keyValue[0]]} value={item[keyValue[0]]}>
      {item[keyValue[1]]}
    </Option>
  ));

export const getValueByKey = (data: any = [], keyValue = ['key', 'value'], key: any) =>
  data.find((d: any) => d[keyValue[0]] === key)
    ? data.find((d: any) => d[keyValue[0]] === key)?.[keyValue[1]]
    : key;

export const getIconByName = (name: any) => {
  switch (name) {
    case 'BankOutlined':
      return <BankOutlined />;
    default:
      return <BarsOutlined />;
  }
};
