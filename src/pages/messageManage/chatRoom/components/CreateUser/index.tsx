import React, { useState } from 'react';
import { Card, Input, Button } from 'antd';
import styles from './index.less';

const CreateUser = (props: any) => {
  const { createUser } = props;
  const [value, setValue] = useState('');

  function create() {
    createUser(value.trim());
    setValue('');
  }
  return (
    <Card title={'创建用户'}>
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
