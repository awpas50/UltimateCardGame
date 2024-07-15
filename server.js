//import { WCard_Data_23246, ICard_Data_23246 } from './client/src/scenes/game.js';
const server = require('express')();

const cors = require('cors');
const serveStatic = require('serve-static');
const shuffle = require('shuffle-array');
let players = {};
let playersInRooms = new Map(); 
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
        //origin: 'https://awpas50.github.io/UltimateCardGame_Frontend/',
        origin: 'http://localhost:8080',
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
        players[socket.id].currentRoomNumber = newRoomId
        socket.emit('buildPlayerNumberText', 1)
        players[socket.id].playerName = 'A'

        console.log(`User ${socket.id} created and joined room ${newRoomId}`);
        console.log("Rooms: " + JSON.stringify(Array.from(socket.rooms)));

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

        for (const [key, value] of playersInRooms.entries()) {
            console.log(`Room ID: ${key}, Sockets: ${Array.from(value)}`);
        }
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
            socket.emit('joinRoomSucceedSignal');
            players[socket.id].currentRoomNumber = roomId
            socket.emit('buildPlayerNumberText', 2)
            players[socket.id].playerName = 'B'

            console.log(`User ${socket.id} joined room ${roomId}`);
            console.log("Rooms: " + JSON.stringify(Array.from(socket.rooms)));

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

            for (const [key, value] of playersInRooms.entries()) {
                console.log(`Room ID: ${key}, Sockets: ${Array.from(value)}`);
            }
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
        currentRoomNumber: '',
        playerName: '', // 'A' or 'B'
        isReady: false,
        roundCount: 1,
        inDeck: [],
        inHand: [],
        
        inRubbishBin: [],
        inDeck_WCard: [],
        inHand_WCard: [],
        inRubbishBin_WCard: [],

        cardCount: 0,
        inSceneElement: [],
        inSceneInspriationPt: [],
        totalInspriationPt: 0,
        totalScore: 0 // 60 to win
    }

    const objLength = Object.keys(players).length;
    console.log("Number of players in the server: " + objLength);
    socket.emit('buildPlayerPointText');
    socket.emit('buildOpponentPointText');

    // Called in SocketHandler
    socket.on('dealDeck', function(socketId, roomId) {
        // imageNames: (Array of string) string[]
        // shuffles an array of string here:
        players[socketId].inDeck = shuffle(mixedArray);
        players[socketId].inDeck_WCard = shuffle(imageNamesWCard);
        console.log(players);
        io.to(roomId).emit('changeGameState', 'Initializing'); 
    })

    // Called in UIHandler.js
    // populates the players[socketId].inHand array with elements from the players[socketId].inDeck array.
    // If the deck is empty, it shuffles and refills the deck before adding cards to the hand.
    socket.on('dealCards', function (socketId, roomId, opponentId) { 
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
        
        if (players[opponentId].isReady === true) {
             // Roll dice: generates a random number between 1 and 6
            gameState = "Ready";
            let roll1 = Math.floor(Math.random() * 6) + 1;
            let roll2;
            // Ensure roll2 is different from roll1
            do {
                roll2 = Math.floor(Math.random() * 6) + 1;
            } while (roll2 === roll1); 

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

    // Used for setting score multiplier at the end of the round
    socket.on('setCardType', function (socketId, elementId, inspriationPt) {
        players[socketId].inSceneElement.push(elementId); // double scores if all elements match
        players[socketId].inSceneInspriationPt.push(inspriationPt); // triple scores if all inspriation points match
        // players[socketId].totalInspriationPt += inspriationPt // triple scores if all inspriation points match
    });

    // Called in InteractiveHandler.js
    socket.on('calculatePoints', function(points, socketId, dropZoneId, roomId) {
        io.to(roomId).emit('calculatePoints', points, socketId, dropZoneId, roomId);
        io.to(roomId).emit('setPlayerPointText');
        io.to(roomId).emit('setOpponentPointText');
        
    });
    
    socket.on('cardPlayed', function (cardName, socketId, dropZoneId, roomId, cardType) {
        io.to(roomId).emit('cardPlayed', cardName, socketId, dropZoneId, roomId, cardType);
        io.to(roomId).emit('changeTurn');
        io.to(roomId).emit('setPlayerTurnText');
    });

    socket.on('setPlayerPoint', function (socketId, playerTotalPoints) {
        players[socketId].totalInspriationPt = playerTotalPoints
    });

    socket.on('addCardCount', function(socketId, opponentId, roomId) {
        players[socketId].cardCount++;
        console.log("players[socketId].cardCount: " + players[socketId].cardCount);
        console.log("players[opponentId].cardCount: " + players[opponentId].cardCount);
        console.log(players)

        if (players[socketId].cardCount >= 4 && players[opponentId].cardCount >= 4) {
            io.to(roomId).emit('setPlayerPointText');
            io.to(roomId).emit('setOpponentPointText');
            endRound()
            //io.to(roomId).emit('endRound', socketId, players[socketId].inSceneElement, players[socketId].inSceneInspriationPt);
        }
    })

    socket.on('disconnect', function () {
        //socket.leave(socket.rooms[1]);
        console.log('A user disconnected: ' + socket.id + ". Number of players in the server: " + objLength);
        delete players[socket.id];
    });
})

http.listen(port, function() {
    console.log('Server Started!');
    console.log(`Server is running in ${process.env.NODE_ENV} mode`);
})

function endRound() {
    
}

function getImageNamesInFolder(folderPath) {
    const files = fs.readdirSync(folderPath);

    // Filter out only the image files (files with .jpg extension)
    const imageNames = files
        .filter(file => path.extname(file).toLowerCase() === '.jpg')
        .map(file => path.basename(file, '.jpg')); // Remove the .jpg extension

    return imageNames;
}



