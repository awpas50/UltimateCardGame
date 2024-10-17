//import { WCard_Data_23246, ICard_Data_23246 } from './client/src/scenes/game.js';
const server = require("express")()

const cors = require("cors")
const serveStatic = require("serve-static")
const shuffle = require("shuffle-array")
let players = {}
let playersInRooms = new Map()
let gameState = "Initializing"

const fs = require("fs")
const path = require("path")
const { Console } = require("console")
const http = require("http").createServer(server)
const port = process.env.PORT || 3000

require("dotenv").config()

const io = require("socket.io")(http, {
    cors: {
        // localhost:8080 is where the client is.
        //origin: 'https://awpas50.github.io/UltimateCardGame_Frontend/',
        origin: "*",
        //origin: process.env.CLIENT_LOCATION,
        methods: ["GET", "POST"],
    },
})

server.use(cors())
server.use(serveStatic(__dirname + "/client/dist"))

io.on("connection", function (socket) {
    console.log("A user connected: " + socket.id)
    // Handle room creation and joining
    socket.on("createRoom", (newRoomId) => {
        socket.join(newRoomId)
        players[socket.id].currentRoomNumber = newRoomId
        socket.emit("buildPlayerNumberText", 1)
        players[socket.id].playerName = "A"

        console.log(`User ${socket.id} created and joined room ${newRoomId}`)
        console.log("Rooms: " + JSON.stringify(Array.from(socket.rooms)))

        // Add player to the list of players in the room
        if (!playersInRooms.has(newRoomId)) {
            playersInRooms.set(newRoomId, new Array())
        }
        const keyToUpdate = newRoomId
        const newItem = socket.id
        // Get the array from the Map based on the key
        const arrayToUpdate = playersInRooms.get(keyToUpdate)
        // Add the new item to the array
        arrayToUpdate.push(newItem)
        // Update the value in the Map with the modified array
        playersInRooms.set(keyToUpdate, arrayToUpdate)
        // Send the list of players in the room to all clients
        io.to(newRoomId).emit("playersInRoom", Array.from(playersInRooms.get(newRoomId)))

        for (const [key, value] of playersInRooms.entries()) {
            console.log(`Room ID: ${key}, Sockets: ${Array.from(value)}`)
        }
    })

    socket.on("joinRoom", (roomId) => {
        if (!io.sockets.adapter.rooms.has(roomId)) {
            console.log(`Room ${roomId} does not exist!`)
            socket.emit("joinRoomFailedSignal")
            return
        } else if (playersInRooms.has(roomId) && playersInRooms.get(roomId).length >= 2) {
            console.log(`Room ${roomId} is full!`)
            socket.emit("joinRoomFullSignal")
            return
        } else {
            socket.join(roomId)
            socket.emit("joinRoomSucceedSignal")
            players[socket.id].currentRoomNumber = roomId
            socket.emit("buildPlayerNumberText", 2)
            players[socket.id].playerName = "B"

            console.log(`User ${socket.id} joined room ${roomId}`)
            console.log("Rooms: " + JSON.stringify(Array.from(socket.rooms)))

            const keyToUpdate = roomId
            const newItem = socket.id
            // Get the array from the Map based on the key
            const arrayToUpdate = playersInRooms.get(keyToUpdate)
            // Add the new item to the array
            arrayToUpdate.push(newItem)
            // Update the value in the Map with the modified array
            playersInRooms.set(keyToUpdate, arrayToUpdate)
            // for (let [key, value] of playersInRooms) {
            //     console.log(`Key: ${key}, Value: ${value}`);
            //   }
            // Send the list of players in the room to all clients
            io.to(roomId).emit("playersInRoom", Array.from(playersInRooms.get(roomId)))

            for (const [key, value] of playersInRooms.entries()) {
                console.log(`Room ID: ${key}, Sockets: ${Array.from(value)}`)
            }
            // imageNames: (Array of string) string[]
            io.to(roomId).emit("changeGameState", "Initializing")
            io.to(roomId).emit("readyToStartGame", players[socket.id])
        }
    })

    let folderPathICard = "./client/dist/assets/23246/ICard"
    let imageNamesICard = getImageNamesInFolder(folderPathICard)

    let folderPathHCard = "./client/dist/assets/23246/HCard"
    let imageNamesHCard = getImageNamesInFolder(folderPathHCard)

    let folderPathWCard = "./client/dist/assets/23246/WCard"
    let imageNamesWCard = getImageNamesInFolder(folderPathWCard)

    let mixedArray = [...imageNamesICard, ...imageNamesHCard]

    players[socket.id] = {
        currentRoomNumber: "",
        playerName: "", // 'A' or 'B'
        isReady: false,
        roundCount: 1,
        inDeck: [],
        inHand: [],
        inScene: [],
        inRubbishBin: [],

        inDeck_WCard: [],
        inScene_WCard: [],
        inRubbishBin_WCard: [],

        inSceneElement: [], // for multiplier
        inSceneInspriationPt: [], // for multiplier
        inSceneAuthorBoostPt: [],
        cardCount: 0,
        totalInspriationPt: 0,
        totalScore: 0, // 60 to win
    }

    const objLength = Object.keys(players).length
    console.log("Number of players in the server: " + objLength)
    socket.emit("buildPlayerPointText")
    socket.emit("buildOpponentPointText")

    // Called in UIHandler.js
    // populates the players[socketId].inHand array with elements from the players[socketId].inDeck array.
    // If the deck is empty, it shuffles and refills the deck before adding cards to the hand.
    socket.on("dealCardsFirstRound", function (socketId, roomId, opponentId) {
        console.log("dealCardsFirstRound: " + roomId)
        for (let i = 0; i < 6; i++) {
            // In JavaScript, you can freely assign different types of values to a variable or object property without declaring their types beforehand.
            // It's completely legitimate to assign a shuffled array even if it was initially declared as an empty array.
            if (players[socketId].inDeck.length === 0) {
                players[socketId].inDeck = shuffle(mixedArray)
            }
            players[socketId].inHand.push(players[socketId].inDeck.shift())
        }
        if (players[socketId].inDeck_WCard.length === 0) {
            players[socketId].inDeck_WCard = shuffle(imageNamesWCard)
        }
        players[socketId].inScene_WCard = []
        players[socketId].inScene_WCard.push(players[socketId].inDeck_WCard.shift())

        // emits the 'addCardsInScene' event to all clients, passing the socketId and the cards dealt to the player's hand.
        io.to(roomId).emit("addICardsHCardsInScene", socketId, players[socketId].inHand)
        io.to(roomId).emit("addWCardsInScene", socketId, players[socketId].inScene_WCard)
        socket.emit("setAuthorElements", players[socketId].inScene_WCard)
        io.to(roomId).emit("setAuthorRarity", socketId, players[socketId].inScene_WCard)

        players[socketId].isReady = true

        if (players[opponentId].isReady === true) {
            // Roll dice: generates a random number between 1 and 6
            gameState = "Ready"
            let roll1 = Math.floor(Math.random() * 6) + 1
            let roll2
            // Ensure roll2 is different from roll1
            do {
                roll2 = Math.floor(Math.random() * 6) + 1
            } while (roll2 === roll1)

            io.to(roomId).emit("RollDice", socketId, roll1, roll2)
            io.to(roomId).emit("decideWhichPlayerfirstTurn", socketId, roll1, roll2)
            io.to(roomId).emit("changeGameState", "Ready")
            io.to(roomId).emit("setPlayerTurnText")
        }
    })

    socket.on("dealCardsAnotherRound", function (socketId, roomId) {
        // **** No need to deal cards again.
        // // emits the 'addCardsInScene' event to all clients, passing the socketId and the cards dealt to the player's hand.
        // io.to(roomId).emit("addICardsHCardsInScene", socketId, players[socketId].inHand)
        io.to(roomId).emit("addWCardsInScene", socketId, players[socketId].inScene_WCard)
        socket.emit("setAuthorElements", players[socketId].inScene_WCard)
        io.to(roomId).emit("setAuthorRarity", socketId, players[socketId].inScene_WCard)

        // Roll dice: generates a random number between 1 and 6
        let roll1 = Math.floor(Math.random() * 6) + 1
        let roll2
        // Ensure roll2 is different from roll1
        do {
            roll2 = Math.floor(Math.random() * 6) + 1
        } while (roll2 === roll1)

        io.to(roomId).emit("RollDice", socketId, roll1, roll2)
        io.to(roomId).emit("decideWhichPlayerfirstTurn", socketId, roll1, roll2)
        io.to(roomId).emit("changeGameState", "Ready")
        io.to(roomId).emit("setPlayerTurnText")
    })

    // Arguments: scene.socket.id, gameObject.getData("id"), scene.GameHandler.currentRoomID
    socket.on("serverUpdateCardInHand", function (socketId, cardName, roomId) {
        players[socketId].inScene.push(cardName)
        // Player: check spot, remove card from spot, add card to spot. Opponent: Add 1 card back
        // Get index, for example, I001 is in index 3 than it will replace the 4th card in players[socketId].inHand
        const cardIndex = players[socketId].inHand.indexOf(cardName)
        // Tell local to delete one card in hand
        io.to(roomId).emit("deleteOneCardInHand", socketId, players[socketId].inHand[cardIndex])
        // Based on card index, replace old card with players[socketId].inDeck[0] as a new card
        players[socketId].inHand.splice(cardIndex, 1, players[socketId].inDeck[0])
        // inDeck delete 1 card
        players[socketId].inDeck.shift()
        // Tell local to actually show one new card
        io.to(roomId).emit("dealOneCardInHand", socketId, players[socketId].inHand[cardIndex], cardIndex)
    })

    // Used for setting score multiplier at the end of the round
    socket.on("serverSetCardType", function (socketId, elementId, inspriationPt) {
        players[socketId].inSceneElement.push(elementId) // double scores if all elements match
        players[socketId].inSceneInspriationPt.push(inspriationPt) // triple scores if all inspriation points match
        // players[socketId].totalInspriationPt += inspriationPt
    })

    // Called in InteractiveHandler.js
    socket.on("serverUpdatePoints", function (points, socketId, dropZoneId, roomId) {
        io.to(roomId).emit("calculatePoints", points, socketId, dropZoneId, roomId)
        io.to(roomId).emit("setPlayerPointText")
        io.to(roomId).emit("setOpponentPointText")
    })

    socket.on("serverNotifyCardPlayed", function (cardName, socketId, dropZoneId, roomId, cardType) {
        io.to(roomId).emit("localInstantiateOpponentCard", cardName, socketId, dropZoneId, cardType)
        io.to(roomId).emit("changeTurn")
        io.to(roomId).emit("setPlayerTurnText")
    })

    socket.on("serverHideRollDiceText", function (socketId, roomId) {
        io.to(roomId).emit("hideRollDiceText", socketId, roomId)
    })

    // socket.on('setPlayerPoint', function (socketId, playerTotalPoints) {
    //     players[socketId].totalInspriationPt = playerTotalPoints
    // });

    socket.on("serverUpdateAuthorBuff", function (socketId, authorBuffPt) {
        players[socketId].inSceneAuthorBoostPt.push(authorBuffPt)
    })

    socket.on("serverUpdateCardCount", function (socketId, opponentId, roomId) {
        players[socketId].cardCount++
        calculateTotalInspriationPts(socketId)
        console.log("players[socketId].cardCount: " + players[socketId].cardCount)
        console.log("players[opponentId].cardCount: " + players[opponentId].cardCount)
        console.log(players)

        if (players[socketId].cardCount >= 4 && players[opponentId].cardCount >= 4) {
            io.to(roomId).emit("setPlayerPointText")
            io.to(roomId).emit("setOpponentPointText")
            endRound(roomId, socketId, opponentId)
        }
    })

    socket.on("disconnect", function () {
        delete players[socket.id]
        console.log("A user disconnected: " + socket.id + ". Number of players in the server: " + objLength)
    })
})

http.listen(port, function () {
    console.log("Server Started!")
    console.log(`Server is running in ${process.env.NODE_ENV} mode`)
})

// * roomId: string * //
function endRound(roomId, socketId, opponentId) {
    const baseScore = 8
    let multiplier = 1
    console.log("round end")
    // should return values
    console.log("socketId: " + socketId)
    console.log("opponentId: " + opponentId)
    console.log(playersInRooms.get(roomId))
    let endRoundRoom = playersInRooms.get(roomId)
    // * player1, player2: string (socket ID) *
    let player1SocketId = endRoundRoom[0]
    let player2SocketId = endRoundRoom[1]
    let whoWinSocketId = ""
    let whoLoseSocketId = ""
    let whoWin = 0

    //check who win
    if (players[player1SocketId].totalInspriationPt > players[player2SocketId].totalInspriationPt) {
        console.log("End round: Player 1 wins")
        whoWinSocketId = player1SocketId
        whoLoseSocketId = player2SocketId
        whoWin = 1
    } else if (players[player1SocketId].totalInspriationPt < players[player2SocketId].totalInspriationPt) {
        console.log("End round: Player 2 wins")
        whoWinSocketId = player2SocketId
        whoLoseSocketId = player1SocketId
        whoWin = 2
    }
    // **** strict type check
    else if (players[player1SocketId].totalInspriationPt === players[player2SocketId].totalInspriationPt) {
        console.log("End round: Draw")
        whoWinSocketId = ""
        whoLoseSocketId = ""
        whoWin = 0
    }
    // set win text (whoWin: Number)
    io.to(roomId).emit("setPlayerWinText", whoWin)
    // if has player win
    if (whoWinSocketId !== "") {
        // 同屬
        if (players[whoWinSocketId].inSceneElement.every((value) => value === players[whoWinSocketId].inSceneElement[0])) {
            multiplier = 2
        }
        // 同靈感值
        if (
            players[whoWinSocketId].inSceneInspriationPt.every(
                (value) => value === players[whoWinSocketId].inSceneInspriationPt[0]
            )
        ) {
            multiplier = 3
        }
        // add scores
        console.log("Added: " + baseScore * multiplier)
        players[whoWinSocketId].totalScore += baseScore * multiplier
        io.to(roomId).emit("setPlayerWinScoreText", players[whoWinSocketId].totalScore, whoWinSocketId)
        io.to(roomId).emit("setPlayerLoseScoreText", players[whoWinSocketId].totalScore, whoWinSocketId)
    }
    setTimeout(() => {
        resetBattleField(roomId, endRoundRoom)
    }, 8000)
}

// endRoundRoom: array (string)
function resetBattleField(roomId, endRoundRoom) {
    for (let i = 0; i < endRoundRoom.length; i++) {
        players[endRoundRoom[i]].inSceneElement = []
        players[endRoundRoom[i]].inSceneInspriationPt = []
        players[endRoundRoom[i]].inSceneAuthorBoostPt = []
        players[endRoundRoom[i]].totalInspriationPt = 0
        players[endRoundRoom[i]].cardCount = 0
        players[endRoundRoom[i]].roundCount++

        // Move all cards in scene to rubbish bin
        while (players[endRoundRoom[i]].inScene.length > 0) {
            players[endRoundRoom[i]].inRubbishBin.push(players[endRoundRoom[i]].inScene.shift())
        }

        if (players[endRoundRoom[i]].inDeck_WCard.length === 0) {
            // Move all cards from inRubbishBin_WCard to inDeck_WCard in one go
            players[endRoundRoom[i]].inDeck_WCard.push(...players[endRoundRoom[i]].inRubbishBin_WCard)
            // Clear the inRubbishBin_WCard array
            players[endRoundRoom[i]].inRubbishBin_WCard.length = 0
        }
        // Move previous WCard to rubbish
        players[endRoundRoom[i]].inRubbishBin_WCard.push(players[endRoundRoom[i]].inScene_WCard.shift())
        players[endRoundRoom[i]].inScene_WCard.push(players[endRoundRoom[i]].inDeck_WCard.shift())
    }

    // Tell local to destroy cards in the scene
    io.to(roomId).emit("clearLocalBattleField")
    console.log(players)
}

//inSceneInspriationPt: []
//inSceneAuthorBoostPt: []
function calculateTotalInspriationPts(socketId) {
    const sum1 = players[socketId].inSceneInspriationPt.reduce((accumulator, currentValue) => {
        const val = currentValue === -1 ? 0 : currentValue
        return accumulator + val
    }, 0)
    const sum2 = players[socketId].inSceneAuthorBoostPt.reduce((accumulator, currentValue) => {
        const val = currentValue === -1 ? 0 : currentValue
        return accumulator + val
    }, 0)
    players[socketId].totalInspriationPt = sum1 + sum2
}

function getImageNamesInFolder(folderPath) {
    const files = fs.readdirSync(folderPath)
    // Filter out only the image files (files with .jpg extension)
    const imageNames = files
        .filter((file) => path.extname(file).toLowerCase() === ".jpg")
        .map((file) => path.basename(file, ".jpg")) // Remove the .jpg extension
    return imageNames
}
