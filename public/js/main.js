const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get user y sala de URL (QS implementación)
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Entrar a la sala
socket.emit('joinRoom', { username, room });

// Get sala y usuarios
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// msg del server (socket)
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // scrollear por el chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// enviar mensajes
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get mensajes
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // emit(socket) en el server
  socket.emit('chatMessage', msg);

  // clear 
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  //query selector cuidado a fallos
  document.querySelector('.chat-messages').appendChild(div);
}

// añadir nombre de la sala al DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// añadir users al DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//warning abandono de chat(arreglar ruta index)
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});