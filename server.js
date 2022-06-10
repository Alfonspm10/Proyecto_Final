const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./funciones/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./funciones/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// static folder (path)
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Whasuup BOT ';

// Ejecuta cuando cliente se conecte
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Bienvenida usuario
    socket.emit('message', formatMessage(botName, 'Bienvenido a Whassup!'));

    // Broadcast cuando usuario conecta
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} se ha unido al chat`)
      );

    // Envia informacion del usuario y la sala
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listener para chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Ejecuta cuando cliente desconecta
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} ha abandonado el chat`)
      );

      // envia informacion usuario y sala
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));