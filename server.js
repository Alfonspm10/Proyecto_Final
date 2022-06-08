const express = require('express');
const http = require('http');
const path = require('path');

const { disconnect } = require('process');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public'))); 

io.on('connection', socket => {
    
    socket.emit('message', 'Bienvenido a Wassup!');

    socket.broadcast.emit('message', 'Un usuario se ha unido a la sala!');

    socket.on('disconnect', () => {
        io.emit('message', 'Un usuario ha abandonado el chat');
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));