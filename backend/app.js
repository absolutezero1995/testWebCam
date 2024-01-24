require("@babel/register");
const express = require("express");
const app = express();

const config = require("./config/serverConfig");

const PORT = 3000;
const IndexRout = require("./routes/Index.routes");

const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

var MAX_BYTES = 65536;
var MAX_UINT32 = 4294967295;

function oldBrowser() {
  throw new Error('Безопасная генерация случайных чисел не поддерживается этим браузером.\nИспользуйте Chrome, Firefox или Internet Explorer 11');
}

var Buffer = require('safe-buffer').Buffer;
var crypto;

if (typeof window !== 'undefined') {
  crypto = window.crypto || window.msCrypto;
} else {
  crypto = require('crypto');
}

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes;
} else {
  module.exports = oldBrowser;
}

function randomBytes(size, cb) {
  if (size > MAX_UINT32) throw new RangeError('запрошено слишком много случайных байтов');

  var bytes = Buffer.allocUnsafe(size);

  if (size > 0) {
    if (size > MAX_BYTES) {
      for (var generated = 0; generated < size; generated += MAX_BYTES) {
        crypto.getRandomValues(bytes.slice(generated, generated + MAX_BYTES));
      }
    } else {
      crypto.getRandomValues(bytes);
    }
  }

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes);
    });
  }

  return bytes;
}

config(app);

let masterStream = null;

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', () => {
    // Присоединение к комнате
    socket.join('video-chat');

    // Если уже есть мастер-поток, отправляем его новому пользователю
    if (masterStream) {
      socket.emit('stream', { socketId: socket.id, stream: masterStream });
    }
  });

  socket.on('offer', (offer, targetSocketId) => {
    // Пересылка предложения другому пользователю
    socket.to(targetSocketId).emit('offer', offer, socket.id);
  });

  socket.on('answer', (answer, targetSocketId) => {
    // Пересылка ответа другому пользователю
    socket.to(targetSocketId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, targetSocketId) => {
    // Пересылка ICE-кандидата другому пользователю
    socket.to(targetSocketId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Обработка нового видеопотока от пользователя
io.of('/').adapter.on('create-room', (room) => {
  if (room === 'video-chat') {
    io.of('/').adapter.rooms[room].on('add', (socketId) => {
      const socket = io.sockets.sockets[socketId];

      if (socket) {
        const userStream = socket.userStream;

        if (userStream) {
          // Создаем новый MediaStream и добавляем в него треки от всех пользователей в комнате
          const combinedStream = new MediaStream();

          io.of('/').adapter.rooms[room].forEach((id) => {
            const userSocket = io.sockets.sockets[id];
            if (userSocket && userSocket.userStream) {
              userSocket.userStream.getTracks().forEach((track) => {
                combinedStream.addTrack(track);
              });
            }
          });

          // Рассылаем обновленный мастер-поток всем пользователям в комнате
          if (combinedStream.getTracks().length > 0) {
            io.to(room).emit('stream', { socketId: 'master', stream: combinedStream });
          }
        }
      }
    });
  }
});

app.use("/", IndexRout);

app.listen(PORT, () => {
  console.log("Сервер запущен на порту:", PORT);
})