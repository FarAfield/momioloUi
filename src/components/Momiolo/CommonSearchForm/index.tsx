import React,{ useEffect,useMemo, useCallback } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker, InputNumber } from 'antd';
import {transferOption} from '@/utils/support';
import styles from './index.less';
import {connect} from 'umi';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const CommonSearchForm = (props:any) => {
  const {
    fetchParams: { type, url, extraArgs },
    searchItems,
    initValue,
    saveFormValues,
    handleFormReset,
    handleFieldsValue,
    dispatch,
  } = props;
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;
  useEffect(() => {
    setFieldsValue({...initValue});
    if(Object.keys(initValue).length){
      onFinish(initValue);
    }
  },[initValue]);

  const onReset = useCallback(() => {
    resetFields();
    handleFormReset && handleFormReset();
    dispatch({
      type,
      payload: { url, ...extraArgs },
    });
  },[]);
  const onFinish = useCallback((fieldsValue) =>{
    // 自定义数据处理
    const values = handleFieldsValue ? handleFieldsValue(fieldsValue) : fieldsValue;
    if (!values || typeof values !== 'object') return;
    // 数据为空处理
    for (let v in values) {
      if (!values[v] || !values[v].toString().trim()) {
        values[v] = undefined;
      }
    }
    // 保存搜索条件
    saveFormValues && saveFormValues(values);
    dispatch({
      type,
      payload: { url, ...values, ...extraArgs },
    });
  },[]);
  const searchAndReset = useMemo(() => {
    // 计算offset
    const offset = 16 - (searchItems.length % 3) * 8;
    return <Col span={8} offset={offset}>
      <div className={styles.searchAndReset}>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button onClick={onReset}>
          重置
        </Button>
      </div>
    </Col>
  },[]);
  const renderForm = useMemo(() => {
    const resultItems = searchItems.map((item:any) => {
      const { type } = item;
      switch (type) {
        case 'input': {
          const { type, key, title, rules, ...rest } = item;
          const placeholder = `请输入${typeof title === 'string' ? title : ''}`;
          return (
              <Col span={8}>
                <FormItem name={key} label={title} rules={rules}>
                  <Input placeholder={placeholder} allowClear {...rest} />
                </FormItem>
              </Col>
          )
        }
        case 'inputNumber': {
          const { type, key, title, rules, style, ...rest } = item;
          const placeholder = `请输入${typeof title === 'string' ? title : ''}`;
          return (
              <Col span={8}>
                <FormItem name={key} label={title} rules={rules}>
                  <InputNumber placeholder={placeholder} allowClear {...rest} style={{ width:'100%', ...style }}/>
                </FormItem>
              </Col>
          )
        }
        case 'select': {
          const { type, key, title, rules,selectOptions = [], keyValue = ['value', 'label'], onSelectChange, ...rest } = item;
          return (
              <Col span={8}>
                <FormItem name={key} label={title} rules={rules}>
                  <Select
                    allowClear
                    showSearch
                    placeholder={'请选择'}
                    onChange={onSelectChange}
                    filterOption={(input, option:any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    {...rest}
                  >
                    { transferOption(selectOptions,keyValue) }
                  </Select>
                </FormItem>
              </Col>
          )
        }
        case 'dataPicker': {
          const { type, key, title, rules, showTime = false,format = 'YYYY-MM-DD', ...rest } = item;
          return (
              <Col span={8}>
                <FormItem name={key} label={title} rules={rules}>
                  <DatePicker
                    allowClear
                    showToday
                    placeholder="请选择"
                    showTime={showTime}
                    format={format}
                    style={{ width: '100%' }}
                    getCalendarContainer={(trigger:any) => trigger.parentNode}
                    {...rest}
                  />
                </FormItem>
              </Col>
          )
        }
        case 'rangePicker': {
          const { type, key, title, rules, showTime = false, format = 'YYYY-MM-DD HH:mm:ss',span = 10, ...rest } = item;
          return (
              <Col span={span}>
                <FormItem name={key} label={title} rules={rules}>
                  <RangePicker
                    allowClear
                    placeholder={['开始时间', '结束时间']}
                    showTime={showTime}
                    style={{ width: '100%' }}
                    format={format}
                    getCalendarContainer={(trigger:any) => trigger.parentNode}
                    {...rest}
                  />
                </FormItem>
              </Col>
          )
        }
        // 调整样式，通常搭配rangePicker使用
        case 'blank': {
          const { key, span = 2 } = item;
          return (
              <Col key={key} span={span}/>
          )
        }
        default:{
          return null;
        }
      }
    });
    resultItems.push(searchAndReset);
    return resultItems;
  },[]);

  return (
      <div>
        <Form {...formItemLayout} form={form} onFinish={onFinish}>
          <Row gutter={24}>
           { renderForm }
          </Row>
        </Form>
      </div>
  )
};
CommonSearchForm.defaultProps = {
  fetchParams:{
    fetchParams:{}
  },
  searchItems:[],
  initValue:{},
};
export default connect()(CommonSearchForm);

