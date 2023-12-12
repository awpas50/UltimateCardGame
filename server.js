const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');
const shuffle = require('shuffle-array');
let players = {};
let readyCheck = 0;
let gameState = "Initializing";

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

io.on('connection', function(socket) {
    console.log('A user connected: ' + socket.id);

    players[socket.id] = {
        inDeck: [],
        inHand: [],
        isPlayerA: false
    }

    if(Object.keys(players).length < 2) {
        players[socket.id].isPlayerA = true;
        io.emit('firstTurn');
    }

    if(players[socket.id].isPlayerA) {
        socket.emit('setPlayerNumberText', 1);
    } else if(!players[socket.id].isPlayerA) {
        socket.emit('setPlayerNumberText', 2);
    }

    socket.on('dealDeck', function(socketId) {
        players[socketId].inDeck = shuffle(["boolean", "ping"]);
        console.log(players);
        if(Object.keys(players) < 2) {
            return;
        }
        io.emit('changeGameState', 'Initializing'); 
    })

    socket.on('dealCards', function (socketId) {
        for (let i = 0; i < 6; i++) {
            if (players[socketId].inDeck.length === 0) {
                players[socketId].inDeck = shuffle(["boolean", "ping"]);
            }
            players[socketId].inHand.push(players[socketId].inDeck.shift());
        }
        console.log(players);
        io.emit('dealCards', socketId, players[socketId].inHand);
        readyCheck++;
        if (readyCheck >= 2) {
            gameState = "Ready";
            io.emit('changeGameState', "Ready");
        }
    });

    socket.on('cardPlayed', function (cardName, socketId) {
        io.emit('cardPlayed', cardName, socketId);
        io.emit('changeTurn');
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        delete players[socket.id];
    });
})

http.listen(3000, function() {
    console.log('Server Started!');
})