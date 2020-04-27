const server = require('express')();
const http = require('http').createServer(server);
const express = require('express');
const io = require('socket.io')(http);

server.use(express.static("."));
server.get('/', (req, res) => {
    res.sendFile(__dirname + '/pong.html');
});
let tabPlayers = [];

io.on('connection', (socket) => {

    if (tabPlayers.length < 4){
        tabPlayers.push(socket.id);
        console.log(tabPlayers);
        socket.emit('newPlayer', tabPlayers.length);
    }else {socket.emit('sessionFull');}

    socket.on('updatePlayerOne', () => {
        io.to(tabPlayers[0]).emit('updatePlayerOne');
    });

    socket.on('updatePlayerOneTwo', () => {
        io.to(tabPlayers[0]).emit('updatePlayerOneTwo');
        io.to(tabPlayers[1]).emit('updatePlayerOneTwo');

    });

    socket.on('updatePlayerOneTwoThree', () => {
        io.to(tabPlayers[0]).emit('updatePlayerOneTwoThree');
        io.to(tabPlayers[1]).emit('updatePlayerOneTwoThree');
        io.to(tabPlayers[2]).emit('updatePlayerOneTwoThree');

    });

    socket.on('startGameClickButton', () => {
        io.to(tabPlayers[0]).emit('startGameClickButton');
    });

    socket.on('pauseGameClickButton', () => {
        io.to(tabPlayers[0]).emit('pauseGameClickButton');
    });

    socket.on('continueGameClickButton', () => {
        io.to(tabPlayers[0]).emit('continueGameClickButton');
    });

    socket.on('playerMoved', (player) => {
        socket.broadcast.emit('playerMoved', player);
    });

    socket.on('reinitPlayers', () => {
        socket.broadcast.emit('reinitPlayers');
    });

    socket.on('ballMoved', (ball) => {
        socket.broadcast.emit('ballMoved', ball);
    });

    socket.on('winnerIs', (winner) => {
        socket.broadcast.emit('winnerIs', winner);
    });

    socket.on('scoreChanged', (score1, score2) => {
        socket.broadcast.emit('scoreChanged', score1, score2);
    });

    socket.on('sendBall', (player) => {
        io.to(tabPlayers[0]).emit('sendBall', player);
    });

    socket.on('disconnect', (socket) => {
        tabPlayers.splice(tabPlayers.indexOf(socket.id),1);
        console.log (tabPlayers);
        //disconnection bloc
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
