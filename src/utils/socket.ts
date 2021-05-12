import io from 'socket.io-client';
import { useState } from 'react';

let socket: any = null;
const createSocket = () => {
  // 本地访问为localhost:9092
  socket = io(`https://www.momiolo.com`, {
    reconnection: true,
    reconnectionDelay: 15000,
    reconnectionAttempts: 10, // 重连次数
    transports: ['websocket', 'polling'],
  });
  socket.on('connect', () => {
    console.log('socket.io已连接');
  });
  socket.on('disconnect', () => {
    console.log('socket.io断开连接');
  });
  socket.on('connect_error', (reason: any) => {
    console.log('socket.io连接失败', reason);
  });
};
const closeSocket = () => socket && socket.disconnect();
// 全局socket发送  isAll(默认0当前客户端  1全部客户端)
const socketSend = (msgContent: string, isAll: string = '0') => {
  socket &&
    socket.emit('sendMsgEvent', {
      msgContent,
      isAll,
    });
};
// 全局socket接收（hooks用法）
const useSocketReceiveEvent = () => {
  const [msgContent, setMsgContent] = useState('');
  socket &&
    socket.on('receiveMsgEvent', (data: string) => {
      setMsgContent(data);
    });
  return msgContent;
};
/**
 *  房间相关：（socket连接时默认加入""房间）
 *  保持唯一房间（加入新房间前需要离开旧房间）
 *  保持多个房间（直接加入新房间，同一客户端可以加入多个房间）
 *  多个客户端加入同一个房间，使用socketRoomSend与useSocketRoomReceiveEvent
 *  其效果等同于使用全局连接并设置isAll为1
 */
// socket加入房间
const socketJoinRoom = (roomId: string) => {
  socket && socket.emit('joinRoom', roomId);
};
// socket离开房间
const socketLeaveRoom = (roomId: string) => {
  socket && socket.emit('leaveRoom', roomId);
};
// 给指定房间内客户端发送消息
const socketRoomSend = (roomId: string, msgContent: string) => {
  socket &&
    socket.emit('sendRoomMsgEvent', roomId, {
      msgContent,
    });
};
// 接收指定房间的消息
const useSocketRoomReceiveEvent = () => {
  const [msgContent, setMsgContent] = useState('');
  socket &&
    socket.on('receiveRoomMsgEvent', (roomId: string, data: string) => {
      setMsgContent(data);
    });
  return msgContent;
};
export {
  createSocket,
  closeSocket,
  socketSend,
  useSocketReceiveEvent,
  socketJoinRoom,
  socketLeaveRoom,
  socketRoomSend,
  useSocketRoomReceiveEvent,
};

// 全局接收事件
// socket.on('receiveMsgEvent', (data: any) => {});

// 全局发送事件
// socket.emit('sendMsgEvent', {
//   msgContent: '',
// });

// 加入房间
// socket.emit('joinRoom', roomId);

// 离开房间
// socket.emit('leaveRoom', roomId);

// 给指定房间发送消息
// socket.emit('sendRoomMsgEvent', roomId, {
//   msgContent: '',
// });

// 接收指定房间的消息
// socket.emit('receiveRoomMsgEvent', (data: any) => {});
