import React, { useState } from 'react';
import { Card, Input, Button, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styles from './index.less';

const CreateUser = (props: any) => {
  const { createUser } = props;
  const [value, setValue] = useState('');

  function create() {
    createUser(value.trim());
    setValue('');
  }
  return (
    <Card
      title={
        <div>
          创建用户
          <Tooltip title="聊天室基于socket实现">
            <MessageOutlined style={{ color: '#999', marginLeft: 4 }} />
          </Tooltip>
        </div>
      }
    >
      <div className={styles.root}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} maxLength={10} />
        <Button type={'primary'} onClick={create} disabled={!value}>
          创建
        </Button>
      </div>
    </Card>
  );
};
export default CreateUser;
