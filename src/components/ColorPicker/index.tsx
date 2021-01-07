import React, { useState, useEffect } from 'react';
import { SketchPicker, BlockPicker } from 'react-color';

const ColorPicker = (props: any) => {
  /**
   * type   Sketch(默认)  Block
   * color存在为受控组件，否则为非受控组件
   */
  const { type, width, presetColors, color, onColorChange } = props;
  // 内部状态
  const [stateColor, setStateColor] = useState('#fff');

  useEffect(() => {
    if (color) {
      setStateColor(color);
    }
  }, [color]);

  return (
    <>
      {type === 'Sketch' && (
        <SketchPicker
          width={width}
          color={stateColor}
          onChangeComplete={(v: any) => {
            onColorChange(v.hex);
            if (!color) {
              setStateColor(v.hex);
            }
          }}
          presetColors={presetColors}
        />
      )}
      {type === 'Block' && (
        <BlockPicker
          width={width}
          color={stateColor}
          onChangeComplete={(v: any) => {
            onColorChange(v.hex);
            if (!color) {
              setStateColor(v.hex);
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
  onColorChange: () => {},
};
export default ColorPicker;
