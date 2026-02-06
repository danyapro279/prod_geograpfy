const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Отдаем файл index.html, когда заходим на главную
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Это нужно, чтобы сервер разрешал подгружать скрипты/картинки из этой же папки
app.use(express.static(__dirname));

let votes = [];

io.on('connection', (socket) => {
    socket.emit('init_votes', votes);
    socket.on('new_vote', (vote) => {
        votes.push(vote);
        io.emit('add_vote', vote);
    });
});

server.listen(3000, () => {
    console.log('Сервер работает на порту 3000');
});