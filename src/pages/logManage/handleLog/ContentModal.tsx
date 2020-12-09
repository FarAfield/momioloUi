import React from 'react';
import { Modal, Button, Input } from 'antd';

const formatJson = (json: any, options: any = {}) => {
  let reg,
    formatted = '',
    pad = 0,
    PADDING = '    ';
  options = options || {};
  options.newlineAfterColonIfBeforeBraceOrBracket =
    options.newlineAfterColonIfBeforeBraceOrBracket === true;
  options.spaceAfterColon = options.spaceAfterColon !== false;
  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  } else {
    json = JSON.parse(json);
    json = JSON.stringify(json);
  }
  reg = /([\{\}])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /([\[\]])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /(\,)/g;
  json = json.replace(reg, '$1\r\n');
  reg = /(\r\n\r\n)/g;
  json = json.replace(reg, '\r\n');
  reg = /\r\n\,/g;
  json = json.replace(reg, ',');
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g;
    json = json.replace(reg, ':{');
    reg = /\:\r\n\[/g;
    json = json.replace(reg, ':[');
  }
  if (options.spaceAfterColon) {
    reg = /\:/g;
    json = json.replace(reg, ':');
  }
  json.split('\r\n').forEach((node: any) => {
    let i = 0,
      indent = 0,
      padding = '';

    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1;
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }

    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }

    formatted += `${padding + node}\r\n`;
    pad += indent;
  });
  return formatted;
};
const TextArea = Input.TextArea;
const ContentModal = (props: any) => {
  const { title, visible, onCancel, text } = props;
  return (
    <Modal
      width="50%"
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" type="primary" onClick={onCancel}>
          返回
        </Button>,
      ]}
    >
      <TextArea autoSize={true} value={formatJson(text)} />
    </Modal>
  );
};
export default ContentModal;
