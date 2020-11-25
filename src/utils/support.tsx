import React from 'react';
import { Select } from 'antd';


const { Option } = Select;



export const transferOption = (arrayData = [], keyValue = ['value', 'label']) => arrayData.map(
    item => <Option key={item[keyValue[0]]} value={item[keyValue[0]]}>{item[keyValue[1]]}</Option>);
