import React, { useState, useEffect, useRef } from 'react';
import { InputNumber } from 'antd';

const EditableInputNumber = (props: any) => {
  const { value: inputNumberValue, onSave, ...rest } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>(undefined);
  const inputNumberRef = useRef(null);

  useEffect(() => {
    setValue(inputNumberValue);
  }, [inputNumberValue]);

  useEffect(() => {
    if (editing) {
      // @ts-ignore
      inputNumberRef && inputNumberRef.current && inputNumberRef.current.focus();
    }
  }, [editing]);

  function save() {
    setEditing(false);
    onSave(value);
  }

  if (editing) {
    return (
      <InputNumber
        ref={inputNumberRef}
        value={value}
        onChange={(v: any) => setValue(v)}
        onPressEnter={save}
        onBlur={save}
        {...rest}
      />
    );
  }
  return (
    <div style={{ minHeight: 20 }} onClick={() => setEditing(true)}>
      {value}
    </div>
  );
};
export default EditableInputNumber;
