import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;
const EditableTextArea = (props: any) => {
  const { value: textAreaValue, onSave, ...rest } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>(undefined);
  const textAreaRef = useRef(null);

  useEffect(() => {
    setValue(textAreaValue);
  }, [textAreaValue]);

  useEffect(() => {
    if (editing) {
      // @ts-ignore
      textAreaRef && textAreaRef.current && textAreaRef.current.focus();
    }
  }, [editing]);

  function save() {
    setEditing(false);
    onSave(value);
  }

  if (editing) {
    return (
      <TextArea
        ref={textAreaRef}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        onPressEnter={save}
        onBlur={save}
        autoSize
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
export default EditableTextArea;
