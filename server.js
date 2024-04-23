//import { WCard_Data_23246, ICard_Data_23246 } from './client/src/scenes/game.js';
const server = require('express')();

const cors = require('cors');
const serveStatic = require('serve-static');
const shuffle = require('shuffle-array');
let players = {};
let readyCheck = 0;
let gameState = "Initializing";

const fs = require('fs');
const path = require('path');
const http = require('http').createServer(server);
const port = process.env.PORT || 3000;

const io = require('socket.io')(http, {
    cors: {
        // localhost:8080 is where the client is.
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

server.use(cors());
server.use(serveStatic(__dirname + "/client/dist"));

io.on('connection', function(socket) {
    console.log('A user connected: ' + socket.id);

    // Handle room creation and joining
    socket.on('createRoom', (newRoomId) => {
        socket.join(newRoomId);
        //players[socketId].roomId = socket.rooms;
        console.log(`User ${socket.id} created and joined room ${newRoomId}`);
        console.log("Rooms: " + socket.rooms);
    });

    socket.on('joinRoom', (roomId) => {
        if(!io.sockets.adapter.rooms.has(roomId)) {
            console.log(`Room ${roomId} does not exist!`);
            return;
        } else {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.emit('joinRoomSucceedSignal');
        }
    });

    let folderPathICard = './client/dist/assets/23246/ICard';
    let imageNamesICard = getImageNamesInFolder(folderPathICard);

    let folderPathHCard = './client/dist/assets/23246/HCard';
    let imageNamesHCard = getImageNamesInFolder(folderPathHCard);

    let folderPathWCard = './client/dist/assets/23246/WCard';
    let imageNamesWCard = getImageNamesInFolder(folderPathWCard);

    let mixedArray = [...imageNamesICard, ...imageNamesHCard];

    players[socket.id] = {
        roomId: {},
        inDeck: [],
        inHand: [],
        inRubbishBin: [],

        inDeck_WCard: [],
        inHand_WCard: [],
        inRubbishBin_WCard: [],

        isPlayerA: false
    }

    if(Object.keys(players).length < 2) {
        players[socket.id].isPlayerA = true;
        //io.emit('firstTurn');
    }

    socket.emit('buildPlayerTurnText');
    socket.emit('buildPlayerPointText');
    if(players[socket.id].isPlayerA) {
        socket.emit('buildPlayerNumberText', 1);
    } else if(!players[socket.id].isPlayerA) {
        socket.emit('buildPlayerNumberText', 2);
    }

    // Called in SocketHandler
    socket.on('dealDeck', function(socketId) {
        // imageNames: (Array of string) string[]
        // shuffles an array of string here:
        players[socketId].inDeck = shuffle(mixedArray);
        players[socketId].inDeck_WCard = shuffle(imageNamesWCard);
        console.log(players);
        if(Object.keys(players) < 2) {
            return;
        }
        io.emit('changeGameState', 'Initializing'); 
    })

    // Called in InteractiveHandler.js
    // populates the players[socketId].inHand array with elements from the players[socketId].inDeck array.
    // If the deck is empty, it shuffles and refills the deck before adding cards to the hand.
    socket.on('dealCards', function (socketId) { 
        for (let i = 0; i < 6; i++) {
            // In JavaScript, you can freely assign different types of values to a variable or object property without declaring their types beforehand.
            // It's completely legitimate to assign a shuffled array even if it was initially declared as an empty array.
            if (players[socketId].inDeck.length === 0) {
                players[socketId].inDeck = shuffle(mixedArray);
            }
            players[socketId].inHand.push(players[socketId].inDeck.shift());
        }

        if (players[socketId].inDeck_WCard.length === 0) {
            players[socketId].inDeck_WCard = shuffle(imageNamesWCard);
        }
        players[socketId].inHand_WCard.push(players[socketId].inDeck_WCard.shift());

        console.log(players);
        // emits the 'addCardsInScene' event to all clients, passing the socketId and the cards dealt to the player's hand.
        io.emit('addICardsHCardsInScene', socketId, players[socketId].inHand);
        io.emit('addWCardsInScene', socketId, players[socketId].inHand_WCard); 
        
        socket.emit('setAuthorElements', players[socketId].inHand_WCard);
        io.emit('setAuthorRarity', socketId, players[socketId].inHand_WCard);

        
        readyCheck++; 
        if (readyCheck >= 2) {
            gameState = "Ready";
            let roll1 = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
            let roll2;
            do {
                roll2 = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
            } while (roll2 === roll1); // Ensure roll2 is different from roll1
            io.emit('RollDice', socketId, roll1, roll2);

            io.emit('decideWhichPlayerfirstTurn', socketId);
            io.emit('changeGameState', "Ready");
            io.emit('setPlayerTurnText');
        }
    });

    socket.on('dealOneCard', function (socketId, position) {
        players[socketId].inHand.splice(position, 0, players[socketId].inDeck[0]);
        players[socketId].inDeck.shift();
    });

    // Called in InteractiveHandler.js
    socket.on('calculatePoints', function(points, socketId, dropZoneID) {
        io.emit('calculatePoints', points, socketId, dropZoneID);
        socket.emit('setPlayerPointText');
    });
    
    socket.on('cardPlayed', function (cardName, socketId, dropZoneID) {
        io.emit('cardPlayed', cardName, socketId, dropZoneID);
        io.emit('changeTurn');
        io.emit('setPlayerTurnText');
    });

    

    socket.on('disconnect', function () {
        socket.leave(socket.rooms[1]);
        console.log('A user disconnected: ' + socket.id);
        delete players[socket.id];
    });
})



http.listen(port, function() {
    console.log('Server Started!');
})

// Function to get image names in a folder
function getImageNamesInFolder(folderPath) {
    // Get the list of files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter out only the image files (files with .jpg extension)
    const imageNames = files
        .filter(file => path.extname(file).toLowerCase() === '.jpg')
        .map(file => path.basename(file, '.jpg')); // Remove the .jpg extension

    return imageNames;
}

