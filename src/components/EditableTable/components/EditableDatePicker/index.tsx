import React, { useState, useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const EditableDatePicker = (props: any) => {
  const { value: dateValue, onSave, format = 'YYYY-MM-DD', ...rest } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>(undefined);
  const datePickerRef = useRef(null);

  useEffect(() => {
    setValue(dateValue);
  }, [dateValue]);

  useEffect(() => {
    if (editing) {
      // @ts-ignore
      datePickerRef && datePickerRef.current && datePickerRef.current.focus();
    }
  }, [editing]);

  function save() {
    setEditing(false);
    onSave(value);
  }

  if (editing) {
    return (
      <DatePicker
        ref={datePickerRef}
        showToday
        format={format}
        value={moment(value, format)}
        onChange={(v: any) => setValue(moment(v).format(format))}
        onBlur={save}
        getCalendarContainer={(trigger: any) => trigger.parentNode}
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
export default EditableDatePicker;
