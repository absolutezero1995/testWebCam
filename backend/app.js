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

// Ограничение для Crypto.getRandomValues()
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
var MAX_BYTES = 65536;

// Node поддерживает запрос до этого количества байт
// https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
var MAX_UINT32 = 4294967295;

function oldBrowser() {
  throw new Error('Безопасная генерация случайных чисел не поддерживается этим браузером.\nИспользуйте Chrome, Firefox или Internet Explorer 11');
}

var Buffer = require('safe-buffer').Buffer;
var crypto;

// Проверяем, находимся ли мы в окружении браузера (имеется ли объект window)
if (typeof window !== 'undefined') {
  // Для окружения браузера используем window.crypto
  crypto = window.crypto || window.msCrypto;
} else {
  // Для окружения Node.js используем встроенный модуль crypto
  crypto = require('crypto');
}

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes;
} else {
  module.exports = oldBrowser;
}

function randomBytes(size, cb) {
  // PhantomJS должен вызвать исключение
  if (size > MAX_UINT32) throw new RangeError('запрошено слишком много случайных байтов');

  var bytes = Buffer.allocUnsafe(size);

  if (size > 0) {  // getRandomValues не работает в IE, если size == 0
    if (size > MAX_BYTES) { // это максимальное количество байтов, которое может обработать crypto.getRandomValues
      // см. https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
      for (var generated = 0; generated < size; generated += MAX_BYTES) {
        // buffer.slice автоматически проверяет, не выходит ли конец за пределы буфера
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

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', () => {
    // Присоединение к комнате
    socket.join('video-chat');
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

app.use("/", IndexRout);

app.listen(PORT, () => {
  console.log("Сервер запущен на порту:", PORT);
});
