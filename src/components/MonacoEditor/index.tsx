import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

const MonacoEditorPro = (props: any) => {
  const { width, height, theme, language } = props;
  const [value, setValue] = useState('');
  const editorDidMount = (editor: any) => {
    editor.focus();
  };
  const onChange = (value: any) => setValue(value);
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
};
export default MonacoEditorPro;
