import React from 'react';
import { Select } from 'antd';
const { Option } = Select;



export const transferOption = (arrayData = [], keyValue = ['value', 'label']) => arrayData.map(
    item => <Option key={item[keyValue[0]]} value={item[keyValue[0]]}>{item[keyValue[1]]}</Option>);


export const getValueByKey = (data = [], keyValue = ['key', 'value'], key:any) =>
    data.find(d => d[keyValue[0]] === key)
        ? data.find(d => d[keyValue[0]] === key)?.[keyValue[1]]
        : key;
