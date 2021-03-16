import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';

const MonacoEditorPro = (props: any) => {
  const { width, height, theme, language, code, saveCode } = props;
  const [value, setValue] = useState('');
  useEffect(() => {
    if (code) {
      setValue(code);
    }
  }, []);
  const editorDidMount = (editor: any) => {
    editor.focus();
  };
  const onChange = (value: any) => {
    setValue(value);
    saveCode(value);
  };
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
      value={value}
      onChange={onChange}
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
  code: '', // 初始值
  saveCode: () => {}, // 保存当前输入的值
};
export default MonacoEditorPro;
