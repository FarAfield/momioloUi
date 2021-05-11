import React, { useState, useEffect, useMemo } from 'react';
import PageCard from '@/components/PageCard';
import ChatBox from './components/ChatBox';
import ChatUser from './components/ChatUser';
import CreateUser from './components/CreateUser';
import { Row, Col, message } from 'antd';
import { getRandom } from '@/utils/support';
import { useSocketReceiveEvent } from '@/utils/socket';

const avatarList = [
  {img: 'https://img.alicdn.com/tfs/TB1m561ntTfau8jSZFwXXX1mVXa-1240-632.jpg'},
  {img: 'https://img.alicdn.com/tfs/TB1hDfN2xv1gK0jSZFFXXb0sXXa-980-500.jpg'},
  {img: 'https://img.alicdn.com/tfs/TB1FtgXsaNj0u4jSZFyXXXgMVXa-980-500.jpg'},
  {img: 'https://img.alicdn.com/tfs/TB1Hc2G2EH1gK0jSZSyXXXtlpXa-980-500.jpg'},
  {img: 'https://img.alicdn.com/tfs/TB1h_vwpzMZ7e4jSZFOXXX7epXa-980-500.jpg'},
  {img: 'https://img.alicdn.com/tfs/TB123pnmhvbeK8jSZPfXXariXXa-980-500.jpg'},
  {img: 'https://img.alicdn.com/tfs/TB1szrB2xD1gK0jSZFsXXbldVXa-1240-632.jpg'},
];


const ChatRoom = () => {
  const [userList, setUserList] = useState<any>([]); // 在线用户列表
  const [messageList, setMessageList] = useState<any>([]);
  const msgContent = useSocketReceiveEvent();

  // 接受socket消息
  useEffect(() => {
    if (msgContent) {
      setMessageList(messageList.concat(JSON.parse(msgContent)));
    }
  }, [msgContent]);
  // 每次messageList变更都让滚动条到底部
  useEffect(() => {
    // 滚动到最新的消息
    const target: any = document.getElementById('chat-box');
    if (target) {
      target.scrollTop = target.scrollHeight;
    }
  },[messageList]);



  function createUser(userNickname: string) {
    if (userList.map((u: any) => u.userNickname).includes(userNickname)) {
      message.warn('用户昵称重复，请重新输入');
      return;
    }
    setUserList(
      userList.concat({
        userNickname,
        userAvatar: avatarList[getRandom(0,6)].img
      }),
    );
  }

  function removeUser(userNickname: string) {
    setUserList(userList.filter((item: any) => item.userNickname !== userNickname));
  }

  const chatUser = useMemo(() => {
    return userList.map((item: any, index: number) => {
      return (
        <ChatUser
          key={index}
          userAvatar={item.userAvatar}
          userNickname={item.userNickname}
          removeUser={removeUser}
        />
      );
    });
  }, [userList]);
  return (
    <PageCard>
      <Row gutter={24}>
        <Col span={12}>
          {chatUser}
          <CreateUser createUser={createUser} />
        </Col>
        <Col span={8} offset={2}>
          <ChatBox messageList={messageList} />
        </Col>
      </Row>
    </PageCard>
  );
};
export default ChatRoom;
