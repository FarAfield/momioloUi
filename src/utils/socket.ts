import io from 'socket.io-client';

export const Socket = (socketServer: string) => {
  const socket = io(`ws://${socketServer}`, {
    reconnection: true,
    reconnectionDelay: 5000,
    transports: ['websocket', 'polling'],
  });
  socket.on('connect', () => {
    console.log('socket.io已连接');
  });
  socket.on('disconnect', () => {
    console.log('socket.io断开连接');
  });
  socket.on('connect_error', (reason:any) => {
    console.log('socket.io连接失败',reason);
  });
  return socket;
};
