const server = require("express")()

const cors = require("cors")
const serveStatic = require("serve-static")
const shuffle = require("shuffle-array")
let players = {}
let playersInRooms = new Map()

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
        players[socket.id].playerName = 1

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
            players[socket.id].playerName = 2

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

    let folderPathICard = "./client/dist/assets/24256/ICard"
    let imageNamesICard = getImageNamesInFolder(folderPathICard)

    let folderPathHCard = "./client/dist/assets/24256/HCard"
    let imageNamesHCard = getImageNamesInFolder(folderPathHCard)

    let folderPathWCard = "./client/dist/assets/24256/WCard"
    let imageNamesWCard = getImageNamesInFolder(folderPathWCard)

    let mixedArray = [...imageNamesICard, ...imageNamesHCard]

    players[socket.id] = {
        currentRoomNumber: "",
        playerName: "", // 1 or 2
        isReady: false,
        roundCount: 1,
        inDeck: [],
        inHand: [],
        inScene: [],
        inRubbishBin: [],

        inDeck_customized_WCard: [],
        inDeck_WCard: [],
        inScene_WCard: [],
        inRubbishBin_WCard: [],

        isHCardActive: false, // for multiplier
        inSceneElementCalculator: [], // for multiplier
        inSceneIPointCalculator: [], // for multiplier
        inSceneSeriesCalculator: [], // for multiplier
        inSceneRarityCalculator: [],
        inSceneAuthorBoostPt: [],
        cardCount: 0,
        totalInspriationPt: 0,
        totalScore: 0, // 60 to win
        extraScore: 0, // extra scores by abilities
    }

    const objLength = Object.keys(players).length
    console.log("Number of players in the server: " + objLength)
    socket.emit("buildPlayerPointText")
    socket.emit("buildOpponentPointText")

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
        if (players[socketId].inDeck_customized_WCard.length === 0) {
            players[socketId].inDeck_WCard = shuffle(imageNamesWCard)
        } else if (players[socketId].inDeck_customized_WCard.length !== 0) {
            players[socketId].inDeck_WCard = players[socketId].inDeck_customized_WCard
        }
        // if (players[socketId].inDeck_WCard.length === 0) {
        //     players[socketId].inDeck_WCard = shuffle(imageNamesWCard)
        // }
        players[socketId].inScene_WCard = []
        players[socketId].inScene_WCard.push(players[socketId].inDeck_WCard.shift())

        // emits the 'addCardsInScene' event to all clients, passing the socketId and the cards dealt to the player's hand.
        io.to(roomId).emit("addWCardsInScene", socketId, players[socketId].inScene_WCard)
        io.to(roomId).emit("setAuthorData", socketId, players[socketId].inScene_WCard)
        io.to(roomId).emit("setAuthorRarity", socketId, players[socketId].inScene_WCard)
        io.to(roomId).emit("addICardsHCardsInScene", socketId, players[socketId].inHand)
        io.to(roomId).emit("localCheckIfAbilityIsSearch", socketId)

        players[socketId].isReady = true

        if (players[opponentId].isReady === true) {
            // Roll dice: generates a random number between 1 and 6
            let roll1 = Math.floor(Math.random() * 6) + 1
            let roll2
            // Ensure roll2 is different from roll1
            do {
                roll2 = Math.floor(Math.random() * 6) + 1
            } while (roll2 === roll1)

            io.to(roomId).emit("RollDice", socketId, roll1, roll2)
            io.to(roomId).emit("decideWhichPlayerFirstTurn", socketId, roll1, roll2)
            io.to(roomId).emit("changeGameState", "Ready")
            io.to(roomId).emit("setPlayerTurnText")

            console.log(players)
        }
    })

    socket.on("dealCardsAnotherRound", function (socketId, roomId, opponentId) {
        console.log("dealCardsAnotherRound")
        // **** No need to deal cards again.
        // // emits the 'addCardsInScene' event to all clients, passing the socketId and the cards dealt to the player's hand.
        // io.to(roomId).emit("addICardsHCardsInScene", socketId, players[socketId].inHand)
        io.to(roomId).emit("addWCardsInScene", socketId, players[socketId].inScene_WCard)
        io.to(roomId).emit("setAuthorData", socketId, players[socketId].inScene_WCard)
        io.to(roomId).emit("setAuthorRarity", socketId, players[socketId].inScene_WCard)
        io.to(roomId).emit("localCheckIfAbilityIsSearch", socketId)

        players[socketId].isReady = true

        if (players[opponentId].isReady === true) {
            // Roll dice: generates a random number between 1 and 6
            let roll1 = Math.floor(Math.random() * 6) + 1
            let roll2
            // Ensure roll2 is different from roll1
            do {
                roll2 = Math.floor(Math.random() * 6) + 1
            } while (roll2 === roll1)

            io.to(roomId).emit("RollDice", socketId, roll1, roll2)
            io.to(roomId).emit("decideWhichPlayerFirstTurn", socketId, roll1, roll2)
            io.to(roomId).emit("changeGameState", "Ready")
            io.to(roomId).emit("setPlayerTurnText")
        }
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

    socket.on("serverAddExtraCardInHand", function (socketId, roomId, filteredCardArray, count) {
        let array = shuffle(filteredCardArray)
        for (let i = 0; i < count; i++) {
            // If inDeck contains the desire card, inDeck delete the specific card
            const index = players[socketId].inDeck.findIndex((cardToRemove) => cardToRemove === array[i])
            console.log(`找到卡牌: ${array[i]} index: ${index}`)
            if (index !== -1) {
                players[socketId].inDeck.splice(index, 1)
                players[socketId].inHand.push(array[i])
                // add 1 card at the right of the inHand deck
                const cardIndex = players[socketId].inHand.length - 1
                // Tell local to actually show one new card
                io.to(roomId).emit("dealOneCardInHand", socketId, array[i], cardIndex)
            }
        }
    })

    // Used for setting score multiplier at the end of the round
    socket.on("serverSetCardType", function (socketId, elementId, inspriationPt, series, rarity) {
        players[socketId].inSceneElementCalculator.push(elementId) // double scores if all elements match
        players[socketId].inSceneIPointCalculator.push(inspriationPt) // triple scores if all inspriation points match
        players[socketId].inSceneSeriesCalculator.push(series) // triple scores if all series match
        players[socketId].inSceneRarityCalculator.push(rarity)
    })
    socket.on("serverSetHCardActiveState", function (socketId, state) {
        players[socketId].isHCardActive = state
    })

    // Called in InteractiveHandler.js
    socket.on("serverUpdatePoints", function (points, socketId, dropZoneId, roomId) {
        io.to(roomId).emit("calculatePoints", points, socketId, dropZoneId, roomId)
        io.to(roomId).emit("setPlayerPointText")
        io.to(roomId).emit("setOpponentPointText")
    })

    socket.on("serverUpdateScores", function (socketId, score, roomId) {
        players[socketId].totalScore += score
        io.to(roomId).emit("setPlayerWinScoreText", players[socketId].totalScore, socketId)
        io.to(roomId).emit("setPlayerLoseScoreText", players[socketId].totalScore, socketId)

        let endRoundRoom = playersInRooms.get(roomId)
        // * player1, player2: string (socket ID) *
        let player1SocketId = endRoundRoom[0]
        let player2SocketId = endRoundRoom[1]

        if (players[player1SocketId].totalScore < 60 && players[player2SocketId].totalScore < 60) {
            return
        }
        // ---- 完場 ----
        // 防止玩家出牌
        players[player1SocketId].isReady = false
        players[player2SocketId].isReady = false
        io.to(roomId).emit("changeGameState", "Initializing")
        if (players[player1SocketId].totalScore > players[player2SocketId].totalScore) {
            io.to(roomId).emit("localGetWhichPlayerWin", player1SocketId)
        } else {
            io.to(roomId).emit("localGetWhichPlayerWin", player2SocketId)
        }
    })

    socket.on("serverNotifyCardPlayed", function (cardName, socketId, dropZoneId, roomId, cardType) {
        io.to(roomId).emit("localInstantiateOpponentCard", cardName, socketId, dropZoneId, cardType)
        io.to(roomId).emit("changeTurn")
        io.to(roomId).emit("setPlayerTurnText")
    })

    socket.on("serverHideRollDiceText", function (socketId, roomId) {
        io.to(roomId).emit("hideRollDiceText", socketId, roomId)
    })

    // authorDeck: array (length of 5)
    socket.on("serverUpdateAuthorDeck", function (socketId, authorDeck) {
        players[socketId].inDeck_customized_WCard = authorDeck
    })

    socket.on("serverUpdateAuthorBuff", function (socketId, authorBuffPt) {
        players[socketId].inSceneAuthorBoostPt.push(authorBuffPt)
    })

    socket.on("serverEndRoundAfterPlayingCard", function (socketId, opponentId, roomId) {
        players[socketId].cardCount++
        calculateTotalInspriationPts(socketId)
        console.log(`場上有${players[socketId].cardCount}+${players[opponentId].cardCount}張牌`)

        if (players[socketId].cardCount >= 4 && players[opponentId].cardCount >= 4) {
            io.to(roomId).emit("setPlayerPointText")
            io.to(roomId).emit("setOpponentPointText")
            endRound(roomId)
        } else {
            console.log(`開始下一回合，對手收到題目`)
            console.log(players)
            io.to(roomId).emit("localInitQuestionCard", opponentId)
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
function endRound(roomId) {
    const drawScore = 4
    const baseScore = 8
    let endRoundRoom = playersInRooms.get(roomId)
    let whoWinSocketId = ""
    let whoWin = 0
    let shouldCheckIPoint = false
    // * player1, player2: string (socket ID) *
    let player1SocketId = endRoundRoom[0]
    let player2SocketId = endRoundRoom[1]

    const player1ScoreBeforeCalculation = players[player1SocketId].totalScore
    const player2ScoreBeforeCalculation = players[player2SocketId].totalScore
    const player1Multiplier = getMultiplier(player1SocketId, 1)
    const player2Multiplier = getMultiplier(player2SocketId, 2)

    console.log(playersInRooms.get(roomId))
    console.log("player1SocketId: " + player1SocketId)
    console.log("player2SocketId: " + player2SocketId)

    // 有玩家做出組合,則檢查組合倍率
    if (player1Multiplier !== 1 || player2Multiplier !== 1) {
        // 有組合會勝於沒有組合。組合倍率較大取勝
        console.log("有玩家做出組合")
        if (player1Multiplier !== player2Multiplier) {
            console.log(`目前對局結束,玩家${player1Multiplier > player2Multiplier ? 1 : 2}勝利`)
            whoWinSocketId = player1Multiplier > player2Multiplier ? player1SocketId : player2SocketId
            whoWin = player1Multiplier > player2Multiplier ? 1 : 2
        } else {
            console.log("雙方都有組合同時倍率一樣：比較靈感值")
            shouldCheckIPoint = true
        }
    } else {
        console.log("沒有玩家做出組合：比較靈感值")
        shouldCheckIPoint = true
    }

    // 沒有組合/組合倍率一樣，比較靈感值
    if (shouldCheckIPoint) {
        //check who win
        const player1Points = players[player1SocketId].totalInspriationPt
        const player2Points = players[player2SocketId].totalInspriationPt

        if (player1Points > player2Points) {
            console.log("目前對局結束,玩家1勝利")
            whoWinSocketId = player1SocketId
            whoWin = 1
        } else if (player1Points < player2Points) {
            console.log("目前對局結束,玩家2勝利")
            whoWinSocketId = player2SocketId
            whoWin = 2
        } else {
            console.log("目前對局結束,平手")
            whoWinSocketId = ""
            whoWin = 0
        }
    }

    // 額外加分,無論是否勝出都會加上 (技能,例如"結算加分")
    players[player1SocketId].totalScore += players[player1SocketId].extraScore
    players[player2SocketId].totalScore += players[player2SocketId].extraScore

    // 計分結果
    io.to(roomId).emit("setPlayerWinText", whoWin)
    if (whoWinSocketId === player1SocketId) {
        console.log("玩家1獲得分數: " + baseScore * player1Multiplier)
        players[player1SocketId].totalScore += baseScore * player1Multiplier
        io.to(roomId).emit("setPlayerWinScoreText", players[player1SocketId].totalScore, player1SocketId)
        io.to(roomId).emit("setPlayerLoseScoreText", players[player1SocketId].totalScore, player1SocketId)
    } else if (whoWinSocketId === player2SocketId) {
        console.log("玩家2獲得分數: " + baseScore * player2Multiplier)
        players[player2SocketId].totalScore += baseScore * player2Multiplier
        io.to(roomId).emit("setPlayerWinScoreText", players[player2SocketId].totalScore, player2SocketId)
        io.to(roomId).emit("setPlayerLoseScoreText", players[player2SocketId].totalScore, player2SocketId)
    } else {
        console.log("雙方各拿4分。")
        for (let i = 0; i < endRoundRoom.length; i++) {
            players[endRoundRoom[i]].totalScore += drawScore
            io.to(roomId).emit("setPlayerWinScoreText", players[endRoundRoom[i]].totalScore, endRoundRoom[i])
            io.to(roomId).emit("setPlayerLoseScoreText", players[endRoundRoom[i]].totalScore, endRoundRoom[i])
        }
    }

    console.log(`玩家1總分: ${player1ScoreBeforeCalculation} >>> ${players[player1SocketId].totalScore}`)
    console.log(`玩家2總分: ${player2ScoreBeforeCalculation} >>> ${players[player2SocketId].totalScore}`)
    console.log(players)

    // 完場狀態
    let endGameState = false
    if (players[player1SocketId].totalScore >= 60 || players[player2SocketId].totalScore >= 60) {
        endGameState = true
    }

    // 防止玩家出牌
    players[player1SocketId].isReady = false
    players[player2SocketId].isReady = false
    io.to(roomId).emit("changeGameState", "Initializing")

    // 完場
    if (endGameState) {
        if (players[player1SocketId].totalScore > players[player2SocketId].totalScore) {
            io.to(roomId).emit("localGetWhichPlayerWin", player1SocketId)
        } else {
            io.to(roomId).emit("localGetWhichPlayerWin", player2SocketId)
        }
    }
    // 繼續
    else {
        setTimeout(() => {
            resetBattleField(roomId, endRoundRoom)
        }, 8000)
    }
}

// endRoundRoom: array (string)
function resetBattleField(roomId, endRoundRoom) {
    for (let i = 0; i < endRoundRoom.length; i++) {
        players[endRoundRoom[i]].inSceneElementCalculator = []
        players[endRoundRoom[i]].inSceneIPointCalculator = []
        players[endRoundRoom[i]].inSceneSeriesCalculator = []
        players[endRoundRoom[i]].inSceneRarityCalculator = []
        players[endRoundRoom[i]].inSceneAuthorBoostPt = []
        players[endRoundRoom[i]].totalInspriationPt = 0
        players[endRoundRoom[i]].cardCount = 0
        players[endRoundRoom[i]].roundCount++
        players[endRoundRoom[i]].extraScore = 0

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
        // Reset ready state
        players[endRoundRoom[i]].isReady = false
    }

    // Tell local to destroy cards in the scene
    io.to(roomId).emit("clearLocalBattleField", endRoundRoom[0])
    console.log(players)
}

//inSceneIPointCalculator: []
//inSceneAuthorBoostPt: []
function calculateTotalInspriationPts(socketId) {
    const sum1 = players[socketId].inSceneIPointCalculator.reduce((accumulator, currentValue) => {
        const val = currentValue === -1 ? 0 : currentValue
        return accumulator + val
    }, 0)
    const sum2 = players[socketId].inSceneAuthorBoostPt.reduce((accumulator, currentValue) => {
        const val = currentValue === -1 ? 0 : currentValue
        return accumulator + val
    }, 0)
    players[socketId].totalInspriationPt = sum1 + sum2
    console.log(`靈感值:${players[socketId].inSceneIPointCalculator}, 作者屬性加成:${players[socketId].inSceneAuthorBoostPt}`)
}

// playerNumber: 1 or 2
function getMultiplier(socketId, playerNumber) {
    let multiplier = 1
    let sameElement = false
    let sameSeries = false
    let sameIPoint = false
    // 成語卡蓋牌，結束倍率計算
    if (!players[socketId].isHCardActive) {
        console.log(`玩家${playerNumber}成語卡蓋牌，結束倍率計算`)
        return 1
    }
    // 同屬
    if (
        players[socketId].inSceneElementCalculator.length === 3 &&
        players[socketId].inSceneElementCalculator[0] != null &&
        players[socketId].inSceneElementCalculator.every((value) => value === players[socketId].inSceneElementCalculator[0])
    ) {
        console.log(`玩家${playerNumber}做出組合：同屬`)
        multiplier = 2
        sameElement = true
    }
    // 同系列
    if (
        players[socketId].inSceneSeriesCalculator.length === 3 &&
        players[socketId].inSceneSeriesCalculator[0] != null &&
        players[socketId].inSceneSeriesCalculator.every((value) => value === players[socketId].inSceneSeriesCalculator[0])
    ) {
        console.log(`玩家${playerNumber}做出組合：同系列`)
        multiplier = 3
        sameSeries = true
    }
    // 同靈感值
    if (
        players[socketId].inSceneIPointCalculator.length === 3 &&
        players[socketId].inSceneIPointCalculator[0] != null &&
        players[socketId].inSceneIPointCalculator.every((value) => value === players[socketId].inSceneIPointCalculator[0])
    ) {
        console.log(`玩家${playerNumber}做出組合：同靈感值`)
        multiplier = 3
        sameIPoint = true
    }
    // 同屬 + 同靈感值
    if (sameElement && sameIPoint) {
        console.log(`玩家${playerNumber}做出組合：同屬 + 同靈感值`)
        multiplier = 4
    }
    return multiplier
}

function getImageNamesInFolder(folderPath) {
    const files = fs.readdirSync(folderPath)
    // Filter out only the image files (files with .jpg extension)
    const imageNames = files
        .filter((file) => path.extname(file).toLowerCase() === ".jpg")
        .map((file) => path.basename(file, ".jpg")) // Remove the .jpg extension
    return imageNames
}
