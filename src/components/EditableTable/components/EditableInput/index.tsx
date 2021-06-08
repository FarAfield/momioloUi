import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';

const EditableInput = (props: any) => {
  const { value: inputValue, onSave, ...rest } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>(undefined);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (editing) {
      // @ts-ignore
      inputRef && inputRef.current && inputRef.current.focus();
    }
  }, [editing]);

  function save() {
    setEditing(false);
    onSave(value);
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
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
export default EditableInput;
