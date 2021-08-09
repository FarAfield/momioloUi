import React from 'react';
import { Select } from 'antd';
import { BankOutlined, BarsOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;
export const transferOption = (arrayData: any = [], keyValue = ['value', 'label']) =>
  arrayData.map((item: any) => (
    <Option key={item[keyValue[0]]} value={item[keyValue[0]]}>
      {item[keyValue[1]]}
    </Option>
  ));

export const getValueByKey = (data: any = [], keyValue = ['key', 'value'], key: any) =>
  data.find((d: any) => d[keyValue[0]] === key)?.[keyValue[1]] || key;

export const getIconByName = (name: any) => {
  switch (name) {
    case 'BankOutlined':
      return <BankOutlined />;
    case 'SettingOutlined':
      return <SettingOutlined />;
    default:
      return <BarsOutlined />;
  }
};

export const formatJson = (str: any) => {
  const stack = [];
  let tmpStr = '';
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    // 当遇到结构块起始结构
    if (str[i] === '{' || str[i] === '[') {
      tmpStr += `${str[i]}\n`;
      stack.push(str[i]);
      tmpStr += '\t'.repeat(stack.length);
    } else if (str[i] === ']' || str[i] === '}') {
      stack.pop();
      tmpStr += `\n${'\t'.repeat(stack.length)}${str[i]}`;
    } else if (str[i] === ',') {
      tmpStr += `${str[i]}\n${'\t'.repeat(stack.length)}`;
    } else {
      tmpStr += str[i];
    }
  }
  return tmpStr;
};

// 判断对象的类型
export const type = (o: any) => {
  const s: any = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

export const getRandom = (minNum: number, maxNum: number) => {
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
};

export const mappingPropsToData = (sourceData = [], mapObj = {}) => {
  return sourceData.map((i: object) => {
    const item = { ...i };
    for (const k of Object.keys(mapObj)) {
      if (Object.keys(item).includes(k)) {
        item[mapObj[k]] = item[k];
        delete item[k];
      }
    }
    return item;
  });
};
