import React, { useState, useEffect } from 'react';
import { SketchPicker, BlockPicker } from 'react-color';

const ColorPicker = (props: any) => {
  /**
   * type   =>    Sketch(默认)    Block
   */
  const { type, width, presetColors, defaultValue, value, onChange } = props;
  // 内部状态
  const [color, setColor] = useState('#fff');
  useEffect(() => {
    if (defaultValue) {
      setColor(defaultValue);
    }
  }, [defaultValue]);
  return (
    <>
      {type === 'Sketch' && (
        <SketchPicker
          width={width}
          color={value || color}
          onChangeComplete={(v: any) => {
            onChange(v.hex);
            if (!value) {
              setColor(v.hex);
            }
          }}
          presetColors={presetColors}
        />
      )}
      {type === 'Block' && (
        <BlockPicker
          width={width}
          color={value || color}
          onChangeComplete={(v: any) => {
            onChange(v.hex);
            if (!value) {
              setColor(v.hex);
            }
          }}
          presetColors={presetColors}
        />
      )}
    </>
  );
};
ColorPicker.defaultProps = {
  type: 'Sketch',
  width: 220,
  presetColors: [
    '#FF6900',
    '#FCB900',
    '#7BDCB5',
    '#00D084',
    '#8ED1FC',
    '#0693E3',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF',
  ],
  defaultValue: '#fff',
  value: '#fff',
  onChange: () => {},
};
export default ColorPicker;
