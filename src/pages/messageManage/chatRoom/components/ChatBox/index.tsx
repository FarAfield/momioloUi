import React from 'react';
import { Avatar } from 'antd';
import styles from './index.less';

const renderMessage = (messageList: any[]) => {
  return messageList.map((item: any, index: number) => {
    if (item.messageType === 'system') {
      return (
        <div key={index} className={styles.systemInfo}>
          {item.messageContent}
        </div>
      );
    }
    // 区分左边和右边的消息显示
    if (item.direction === 'left') {
      return (
        <div key={index} className={styles.normalInfoLeft}>
          <div className={styles.avatar}>
            <Avatar shape="square" size="large" src={item.userAvatar} />
          </div>
          <div className={styles.message}>
            <div className={styles.nick}>{item.userNickname}</div>
            <div className={styles.text}>{item.messageContent}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className={styles.normalInfoRight}>
          <div className={styles.message}>
            <div className={styles.nick}>{item.userNickname}</div>
            <div className={styles.text}>{item.messageContent}</div>
          </div>
          <div className={styles.avatar}>
            <Avatar shape="square" size="large" src={item.userAvatar} />
          </div>
        </div>
      );
    }
  });
};

const ChatBox = (props: any) => {
  const { roomTitle, messageList } = props;
  return (
    <div className={styles.root}>
      <div className={styles.header}>{roomTitle}</div>
      <div className={styles.content} id={'chat-box'}>
        {renderMessage(messageList)}
      </div>
    </div>
  );
};
ChatBox.defaultProps = {
  roomTitle: '聊天室',
  messageList: [],
};
export default ChatBox;

/**
 *   messageList
 *       messageType: system  /  normal
 *       messageContent
 *
 *       ---若为normal则包含以下信息---
 *
 *       userAvatar
 *       userNickname
 *       direction: 区分在哪一边展示
 */
