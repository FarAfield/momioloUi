import React, { useState, useEffect } from 'react';
import { Card, Input, Avatar, Button, Switch } from 'antd';
import { socketSend } from '@/utils/socket';
import styles from './index.less';

const { TextArea } = Input;
const ChatUser = (props: any) => {
  const { userAvatar, userNickname, removeUser } = props;
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    socketSend(
      JSON.stringify({
        messageType: 'system',
        messageContent: `${userNickname}加入群聊`,
      }),
      '1',
    );
    return () => {
      socketSend(
        JSON.stringify({
          messageType: 'system',
          messageContent: `${userNickname}退出群聊`,
        }),
        '1',
      );
    };
  }, []);

  function send() {
    if (value) {
      socketSend(
        JSON.stringify({
          messageType: 'normal',
          messageContent: value,
          userAvatar,
          userNickname,
          direction: checked ? 'right' : 'left',
        }),
        '1',
      );
      setValue('');
    }
  }
  function exit() {
    removeUser(userNickname);
  }

  return (
    <Card extra={<a onClick={exit}>离开</a>} className={styles.root}>
      <div className={styles.title}>
        <div>
          <Avatar size={'large'} src={userAvatar} />
          <div>{userNickname}</div>
        </div>
        <Switch
          checkedChildren="右"
          unCheckedChildren="左"
          checked={checked}
          onChange={(v) => setChecked(v)}
        />
      </div>
      <div className={styles.item}>
        <TextArea
          autoSize={{ minRows: 1, maxRows: 50 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type={'primary'} onClick={send}>
          发送
        </Button>
      </div>
    </Card>
  );
};
ChatUser.defaultProps = {
  userAvatar: '',
  userNickname: '',
};
export default ChatUser;
