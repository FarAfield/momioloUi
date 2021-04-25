import React from 'react';
import { Modal, Button, Input } from 'antd';
import { formatJson } from '@/utils/support'

const {TextArea} = Input;
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
