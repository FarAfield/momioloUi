import io from 'socket.io-client';

let socket: any = null;
const createSocket = (socketServer: string) => {
  // 本地访问为ws
  socket = io(`https://${socketServer}`, {
    reconnection: true,
    reconnectionDelay: 15000,
    reconnectionAttempts:10, // 重连次数
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
const closeSocket = () => socket.disconnect();
export { socket, createSocket, closeSocket };


// 全局接收事件
// socket.on('receiveMsgEvent', (data: any) => {
// });

// 全局发送事件
// socket.emit('sendMsgEvent', {
//   msgContent: '',
// });

// 加入房间
// socket.emit('joinRoom',roomId);

// 离开房间
// socket.emit('leaveRoom',roomId);

// 给指定房间发送事件
// socket.emit('sendRoomMsgEvent', {
//   msgContent:'',
// },roomId);
