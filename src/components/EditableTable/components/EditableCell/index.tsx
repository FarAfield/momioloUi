import React, { useState, useEffect, useRef } from 'react';
import { Input, InputNumber, Select, DatePicker } from 'antd';
import { getValueByKey, transferOption } from '@/utils/support';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;
const EditableCell = (props: any) => {
  const {
    type,
    value,
    onSave,
    selectOptions = [], // select专用
    keyValue = ['value', 'label'], // select专用
    format = 'YYYY-MM-DD', // datePicker专用
    ...rest
  } = props;
  const [editing, setEditing] = useState<boolean>(false);
  const [stateValue, setStateValue] = useState<any>(undefined);
  const ref = useRef(null);

  useEffect(() => {
    setStateValue(value);
  }, [value]);

  // 编辑状态下聚焦
  useEffect(() => {
    if (editing) {
      // @ts-ignore
      ref && ref.current && ref.current.focus();
    }
  }, [editing]);

  function save() {
    setEditing(false);
    onSave(stateValue);
  }

  /**
   *  Input
   */
  const renderInputCell = () => {
    if (editing) {
      return (
        <Input
          ref={ref}
          value={stateValue}
          onChange={(e: any) => setStateValue(e.target.value)}
          onPressEnter={save}
          onBlur={save}
          {...rest}
        />
      );
    }
    return (
      <div className={styles.cell} onClick={() => setEditing(true)}>
        {stateValue}
      </div>
    );
  };
  /**
   * TextArea
   */
  const renderTextAreaCell = () => {
    if (editing) {
      return (
        <TextArea
          ref={ref}
          value={stateValue}
          onChange={(e: any) => setStateValue(e.target.value)}
          onPressEnter={save}
          onBlur={save}
          autoSize
          {...rest}
        />
      );
    }
    return (
      <div className={styles.cell} onClick={() => setEditing(true)}>
        {stateValue}
      </div>
    );
  };
  /**
   * InputNumber
   */
  const renderInputNumberCell = () => {
    if (editing) {
      return (
        <InputNumber
          ref={ref}
          value={stateValue}
          onChange={(v: any) => setStateValue(v)}
          onPressEnter={save}
          onBlur={save}
          {...rest}
        />
      );
    }
    return (
      <div className={styles.cell} onClick={() => setEditing(true)}>
        {stateValue}
      </div>
    );
  };
  /**
   *  Select
   */
  const renderSelectCell = () => {
    if (editing) {
      return (
        <Select
          ref={ref}
          value={stateValue}
          onChange={(v: any) => setStateValue(v)}
          onBlur={save}
          className={styles.select}
          showSearch
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          {...rest}
        >
          {transferOption(selectOptions, keyValue)}
        </Select>
      );
    }
    return (
      <div className={styles.cell} onClick={() => setEditing(true)}>
        {getValueByKey(selectOptions, keyValue, stateValue)}
      </div>
    );
  };
  /**
   *  DatePicker
   */
  const renderDatePickerCell = () => {
    if (editing) {
      return (
        <DatePicker
          ref={ref}
          value={moment(stateValue, format)}
          onChange={(v: any) => setStateValue(moment(v).format(format))}
          onBlur={save}
          showToday
          format={format}
          getCalendarContainer={(trigger: any) => trigger.parentNode}
          {...rest}
        />
      );
    }
    return (
      <div className={styles.cell} onClick={() => setEditing(true)}>
        {stateValue}
      </div>
    );
  };

  switch (type) {
    case 'input':
      return renderInputCell();
    case 'textArea':
      return renderTextAreaCell();
    case 'inputNumber':
      return renderInputNumberCell();
    case 'select':
      return renderSelectCell();
    case 'datePicker':
      return renderDatePickerCell();
    default:
      return null;
  }
};
export default EditableCell;

/**
 *   type  指定渲染cell类型  input/inputNumber/textArea/select/datePicker
 *   value 指定cell的值
 *   onSave 指定cell值保存时的方法 v => {}
 *
 *     非必传属性
 *     selectOptions = [], // select专用
 *     keyValue = ['value', 'label'], // select专用
 *     format = 'YYYY-MM-DD', // datePicker专用
 *
 *     rest  除以上属性外，其余属性会被透传给对应渲染组件
 */
