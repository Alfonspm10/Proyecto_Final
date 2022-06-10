const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


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

  // emit(socker) en el server
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
  document.querySelector('.chat-messages').appendChild(div);
}

// añadir nombre de la sala al DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
;