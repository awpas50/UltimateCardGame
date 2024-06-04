//import { WCard_Data_23246, ICard_Data_23246 } from './client/src/scenes/game.js';
const server = require('express')();

const cors = require('cors');
const serveStatic = require('serve-static');
const shuffle = require('shuffle-array');
let players = {};
let readyCheck = 0;
let playersInRooms = new Map(); // Map to store players in rooms
let gameState = "Initializing";

const fs = require('fs');
const path = require('path');
const { Console } = require('console');
const http = require('http').createServer(server);
const port = process.env.PORT || 3000;

require('dotenv').config();

const io = require('socket.io')(http, {
    cors: {
        // localhost:8080 is where the client is.
        origin: 'https://awpas50.github.io/UltimateCardGame_Frontend/',
        //origin: 'http://localhost:8080',
        //origin: process.env.CLIENT_LOCATION,
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
        console.log("Rooms: " + JSON.stringify(Array.from(socket.rooms)));
        socket.emit('buildPlayerNumberText', 1);

        // Add player to the list of players in the room
        if (!playersInRooms.has(newRoomId)) {
            playersInRooms.set(newRoomId, new Array());
        }
        
        const keyToUpdate = newRoomId;
        const newItem = socket.id;
        // Get the array from the Map based on the key
        const arrayToUpdate = playersInRooms.get(keyToUpdate);
        // Add the new item to the array
        arrayToUpdate.push(newItem);
        // Update the value in the Map with the modified array
        playersInRooms.set(keyToUpdate, arrayToUpdate);
        // Send the list of players in the room to all clients
        io.to(newRoomId).emit('playersInRoom', Array.from(playersInRooms.get(newRoomId)));
    });

    socket.on('joinRoom', (roomId) => {
        if(!io.sockets.adapter.rooms.has(roomId)) {
            console.log(`Room ${roomId} does not exist!`);
            return;
        }
        else if (playersInRooms.has(roomId) && playersInRooms.get(roomId).length >= 2) {
            console.log(`Room ${roomId} is full!`);
            return;
        } else {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.emit('joinRoomSucceedSignal');
            socket.emit('buildPlayerNumberText', 2);

            // Add player to the list of players in the room
            // if (!playersInRooms.has(roomId)) {
            //     playersInRooms.set(roomId, new Array());
            // }
            
            const keyToUpdate = roomId;
            const newItem = socket.id;
            // Get the array from the Map based on the key
            const arrayToUpdate = playersInRooms.get(keyToUpdate);
            // Add the new item to the array
            arrayToUpdate.push(newItem);
            // Update the value in the Map with the modified array
            playersInRooms.set(keyToUpdate, arrayToUpdate);
            // for (let [key, value] of playersInRooms) {
            //     console.log(`Key: ${key}, Value: ${value}`);
            //   }
            // Send the list of players in the room to all clients
            io.to(roomId).emit('playersInRoom', Array.from(playersInRooms.get(roomId)));
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

        cardCount: 0,
        isReady: false
    }

    const roomsArray = Array.from(socket.rooms);

    const objLength = Object.keys(players).length;
    console.log("Number of players in the server: " + objLength);

    //socket.emit('buildPlayerTurnText');
    socket.emit('buildPlayerPointText');
    socket.on('HelloWorld', function() {
        console.log(players);
    })

    // Called in SocketHandler
    socket.on('dealDeck', function(socketId, roomId) {
        // imageNames: (Array of string) string[]
        // shuffles an array of string here:
        players[socketId].inDeck = shuffle(mixedArray);
        players[socketId].inDeck_WCard = shuffle(imageNamesWCard);
        console.log(players);
        // if(Object.keys(players) < 2) {
        //     return;
        // }
        io.to(roomId).emit('changeGameState', 'Initializing'); 
    })

    // Called in UIHandler.js
    // populates the players[socketId].inHand array with elements from the players[socketId].inDeck array.
    // If the deck is empty, it shuffles and refills the deck before adding cards to the hand.
    socket.on('dealCards', function (socketId, roomId, opponentID) { 
        console.log("dealCards: " + roomId);
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
        // emits the 'addCardsInScene' event to all clients, passing the socketId and the cards dealt to the player's hand.
        io.to(roomId).emit('addICardsHCardsInScene', socketId, players[socketId].inHand);
        io.to(roomId).emit('addWCardsInScene', socketId, players[socketId].inHand_WCard); 
        
        socket.emit('setAuthorElements', players[socketId].inHand_WCard);
        io.to(roomId).emit('setAuthorRarity', socketId, players[socketId].inHand_WCard);
        
        players[socketId].isReady = true;
        
        if (players[opponentID].isReady === true) {
            gameState = "Ready";
            let roll1 = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
            let roll2;
            do {
                roll2 = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
            } while (roll2 === roll1); // Ensure roll2 is different from roll1
            io.to(roomId).emit('RollDice', socketId, roll1, roll2);

            io.to(roomId).emit('decideWhichPlayerfirstTurn', socketId, roll1, roll2);
            io.to(roomId).emit('changeGameState', "Ready");
            io.to(roomId).emit('setPlayerTurnText');
        }
    });

    // Arguments: scene.socket.id, gameObject.getData("id"), scene.GameHandler.currentRoomID
    socket.on('dealOneCardInServer', function (socketId, cardName, roomId) {
        // Player: check spot, remove card from spot, add card to spot
        // Opponent: Add 1 card back
        // Get index, for example, I001 is in index 3 than it will replace the 4th card in players[socketId].inHand
        const cardIndex = players[socketId].inHand.indexOf(cardName);
        // Based on card index, replace old card with players[socketId].inDeck[0] as a new card
        players[socketId].inHand.splice(cardIndex, 1, players[socketId].inDeck[0]);
        // inDeck delete 1 card
        players[socketId].inDeck.shift();
        // Tell local to actually show one new card
        io.to(roomId).emit('dealOneCardInScene', socketId, players[socketId].inHand, cardIndex);
    });

    // Called in InteractiveHandler.js
    socket.on('calculatePoints', function(points, socketId, dropZoneID, roomId) {
        io.to(roomId).emit('calculatePoints', points, socketId, dropZoneID, roomId);
        socket.emit('setPlayerPointText');
    });
    
    socket.on('cardPlayed', function (cardName, socketId, dropZoneID, roomId, cardType) {
        io.to(roomId).emit('cardPlayed', cardName, socketId, dropZoneID, roomId, cardType);
        io.to(roomId).emit('changeTurn');
        io.to(roomId).emit('setPlayerTurnText');
    });

    socket.on('addCardCount', function(socketID, opponentID, roomId) {
        players[socketID].cardCount++;
        console.log("players[socketID].cardCount: " + players[socketID].cardCount);
        console.log("players[opponentID].cardCount: " + players[opponentID].cardCount);

        if (players[socketID].cardCount >= 4 && players[opponentID].cardCount >= 4) {
            console.log("END");
            io.to(roomId).emit('endRound', socketID);
        }
        //io.to(roomId).emit('checkIfFinishRound', socketID, opponentID, roomId);
    })
    socket.on('checkIfFinishRound', function(socketID, opponentID, roomId) {
        
    })

    socket.on('disconnect', function () {
        //socket.leave(socket.rooms[1]);
        console.log('A user disconnected: ' + socket.id);
        delete players[socket.id];
    });
})

http.listen(port, function() {
    console.log('Server Started!');
    console.log(`Server is running in ${process.env.NODE_ENV} mode`);
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

