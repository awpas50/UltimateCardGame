const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');
const shuffle = require('shuffle-array');
let players = {};
let readyCheck = 0;

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

    socket.on('dealDeck', function(socketId) {
        players[socketId].inDeck = shuffle(["boolean", "ping"]);
        console.log(players);

        if(Object.keys(players)) {
            return;
        }
        
        io.emit('changeGameState', 'Initializing');
    })
})

http.listen(3000, function() {
    console.log('Server Started!');
})