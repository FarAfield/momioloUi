import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

const MonacoEditorPro = (props: any) => {
  const { width, height, theme, language, defaultValue, value, onChange } = props;
  const [code, setCode] = useState('');
  const editorDidMount = (editor: any) => {
    // 是否初始加载时聚焦
    // editor.focus();
  };
  useEffect(() => {
    if (defaultValue) {
      setCode(defaultValue);
    }
  }, [defaultValue]);
  const options = {
    selectOnLineNumbers: true,
    renderSideBySide: false,
  };
  return (
    <MonacoEditor
      width={width}
      height={height}
      theme={theme}
      language={language}
      value={value || code}
      onChange={(v) => {
        onChange(v);
        if (!value) {
          setCode(v);
        }
      }}
      options={options}
      editorDidMount={editorDidMount}
    />
  );
};
MonacoEditorPro.defaultProps = {
  width: '100%',
  height: 400,
  theme: 'vs-dark', // 'vs', 'vs-dark', 'hc-black'
  language: 'json',
  defaultValue: '', // 默认值
  onChange: () => {}, // 保存当前输入的值
};
export default MonacoEditorPro;
