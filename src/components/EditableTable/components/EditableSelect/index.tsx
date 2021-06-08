import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import { transferOption, getValueByKey } from '@/utils/support';

const EditableSelect = (props: any) => {
  const {
    value: selectValue,
    onSave,
    selectOptions = [],
    keyValue = ['value', 'label'],
    ...rest
  } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>(undefined);
  const selectRef = useRef(null);

  useEffect(() => {
    setValue(selectValue);
  }, [selectValue]);

  useEffect(() => {
    if (editing) {
      // @ts-ignore
      selectRef && selectRef.current && selectRef.current.focus();
    }
  }, [editing]);

  function save() {
    setEditing(false);
    onSave(value);
  }

  if (editing) {
    return (
      <Select
        ref={selectRef}
        showSearch
        value={value}
        onChange={(v: any) => setValue(v)}
        onBlur={save}
        filterOption={(input, option: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        style={{ minWidth: 80 }}
        {...rest}
      >
        {transferOption(selectOptions, keyValue)}
      </Select>
    );
  }
  return (
    <div style={{ minHeight: 20 }} onClick={() => setEditing(true)}>
      {getValueByKey(selectOptions, keyValue, value)}
    </div>
  );
};
export default EditableSelect;
