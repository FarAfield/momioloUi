import React from 'react';
import { SketchPicker, BlockPicker } from 'react-color';
import { useControlledProps } from '@/utils/hooks';

const ColorPicker = (props: any) => {
  /**
   * type   =>    Sketch(默认)    Block
   */
  const { type, width, presetColors, ...rest } = props;
  const { value, onChange } = useControlledProps(rest);
  return (
    <>
      {type === 'Sketch' && (
        <SketchPicker
          width={width}
          color={value}
          onChangeComplete={(v: any) => {
            onChange(v.hex);
          }}
          presetColors={presetColors}
        />
      )}
      {type === 'Block' && (
        <BlockPicker
          width={width}
          color={value}
          onChangeComplete={(v: any) => {
            onChange(v.hex);
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
  onChange: () => {},
};
export default ColorPicker;
