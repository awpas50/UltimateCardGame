const server = require("./server-init")

const serveStatic = require("serve-static")
const shuffle = require("shuffle-array")
let players = {}
let playersInRooms = new Map()

const fs = require("fs")
const path = require("path")
const { Console } = require("console")
// const { getAccountInfoFromGoogleSheets } = require("./google-sheets-info.js")
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

server.use(serveStatic(__dirname + "/client/dist"))

io.on("connection", async function (socket) {
    console.log("A user connected: " + socket.id)
    // const resp = await getAccountInfoFromGoogleSheets()
    // console.log(resp)
    // Handle room creation and joining
    socket.on("createRoom", (newRoomId) => {
        socket.join(newRoomId)
        players[socket.id].currentRoomNumber = newRoomId
        socket.emit("buildPlayerNumberText", 1, players[socket.id].nickname)
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
            socket.emit("buildPlayerNumberText", 2, players[socket.id].nickname)
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
            const playersInRoomArray = Array.from(playersInRooms.get(roomId))
            io.to(roomId).emit("playersInRoom", playersInRoomArray)
            console.log("Players in room (Array): " + playersInRoomArray)
            const opponentInRoomArray = playersInRoomArray.filter((id) => id !== socket.id)
            const [opponentId] = opponentInRoomArray
            console.log("opponentId: " + opponentId)
            console.log("opponent nickname: " + players[opponentId].nickname)

            io.to(socket.id).emit("localSetOpponentNickname", players[opponentId].nickname)
            io.to(opponentId).emit("localSetOpponentNickname", players[socket.id].nickname)

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
        nickname: "",
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

        multiplierSpecialRule: null,
        multiplierSpecialRuleCheck: null,
        multiplierSpecialCount: 1,
        isHCardActive: false, // for multiplier
        inSceneElementCalculator: [null, null, null], // for multiplier
        inSceneIPointCalculator: [null, null, null], // for multiplier
        inSceneSeriesCalculator: [null, null, null], // for multiplier
        inSceneRarityCalculator: [null, null, null],
        inSceneAuthorBoostPt: [0, 0, 0],
        cardCount: 0,
        totalInspriationPt: 0,
        totalScore: 0, // 60 to win
        extraScore: 0, // extra scores by abilities
    }

    const objLength = Object.keys(players).length
    console.log("Number of players in the server: " + objLength)
    socket.emit("buildPlayerPointText")
    socket.emit("buildOpponentPointText")

    socket.on("serverSetNickname", function (socketId, nickname) {
        players[socketId].nickname = nickname
    })

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
        io.to(roomId).emit(
            "localCheckIfAbilityIsSearch",
            socketId,
            players[socketId].inRubbishBin_WCard.concat(players[opponentId].inRubbishBin_WCard)
        )
        io.to(roomId).emit("localCheckIfAbilityIsMultiplier", socketId)

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
        io.to(roomId).emit(
            "localCheckIfAbilityIsSearch",
            socketId,
            players[socketId].inRubbishBin_WCard.concat(players[opponentId].inRubbishBin_WCard)
        )
        io.to(roomId).emit("localCheckIfAbilityIsMultiplier", socketId)

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
        io.to(roomId).emit("dealOneCardInHand", socketId, players[socketId].inHand[cardIndex], cardIndex, false)
    })

    socket.on("serverAddExtraCardInHand", function (socketId, roomId, filteredCardArray, whereToSearch, count) {
        let array = shuffle(filteredCardArray)
        for (let i = 0; i < count; i++) {
            // If inDeck contains the desire card, inDeck delete the specific card
            let index
            if (whereToSearch === "inDeck") {
                index = players[socketId].inDeck.findIndex((cardToRemove) => cardToRemove === array[i])
            } else if (whereToSearch === "inRubbishBin") {
                index = players[socketId].inRubbishBin.findIndex((cardToRemove) => cardToRemove === array[i])
            }
            console.log(`找到卡牌: ${array[i]} index: ${index}`)
            if (index !== -1) {
                if (whereToSearch === "inDeck") {
                    players[socketId].inDeck.splice(index, 1)
                } else if (whereToSearch === "inRubbishBin") {
                    players[socketId].inRubbishBin.splice(index, 1)
                }
                players[socketId].inDeck.splice(index, 1)
                players[socketId].inHand.push(array[i])
                // add 1 card at the right of the inHand deck
                const cardIndex = players[socketId].inHand.length - 1
                // Tell local to actually show one new card
                io.to(roomId).emit("dealOneCardInHand", socketId, array[i], cardIndex, true)
            }
        }
    })

    // Used for setting score multiplier at the end of the round
    // position: 天(0), 地(1), 人(2)
    socket.on("serverSetCardType", function (socketId, position, elementId, inspriationPt, series, rarity, authorBuffPt) {
        players[socketId].inSceneElementCalculator[position] = elementId // double scores if all elements match
        players[socketId].inSceneIPointCalculator[position] = inspriationPt // triple scores if all inspriation points match
        players[socketId].inSceneSeriesCalculator[position] = series // triple scores if all series match
        players[socketId].inSceneRarityCalculator[position] = rarity
        players[socketId].inSceneAuthorBoostPt[position] = authorBuffPt
    })
    socket.on("serverSetHCardActiveState", function (socketId, state) {
        players[socketId].isHCardActive = state
    })
    socket.on("serverSetSpecialMultiplierRules", function (socketId, multiplier, formula, check) {
        players[socketId].multiplierSpecialRule = formula
        players[socketId].multiplierSpecialRuleCheck = check
        players[socketId].multiplierSpecialCount = multiplier
    })

    // Called in InteractiveHandler.js
    socket.on("serverUpdatePoints", function (points, socketId, dropZoneId, roomId) {
        io.to(roomId).emit("calculatePoints", points, socketId, dropZoneId, roomId)
        io.to(roomId).emit("setPlayerPointText")
        io.to(roomId).emit("setOpponentPointText")
    })

    socket.on("serverUpdateExtraScores", function (socketId, extraScore) {
        players[socketId].extraScore += extraScore
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
        // Excel 結算積分
        io.to(player1SocketId).emit("addScoresToExcel", players[player1SocketId].totalScore)
        io.to(player2SocketId).emit("addScoresToExcel", players[player2SocketId].totalScore)
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

    // DEBUG
    socket.on("serverGetPlayerStats", (socketId, mode = "all", callback) => {
        switch (mode) {
            case "scores":
                const {
                    isHCardActive,
                    inSceneElementCalculator,
                    inSceneIPointCalculator,
                    inSceneSeriesCalculator,
                    inSceneRarityCalculator,
                    inSceneAuthorBoostPt,
                    cardCount,
                    totalInspriationPt,
                    totalScore,
                    extraScore,
                } = players[socketId] || {}
                callback({
                    isHCardActive,
                    inSceneElementCalculator,
                    inSceneIPointCalculator,
                    inSceneSeriesCalculator,
                    inSceneRarityCalculator,
                    inSceneAuthorBoostPt,
                    cardCount,
                    totalInspriationPt,
                    totalScore,
                    extraScore,
                })
                callback(players[socketId])
                break
            case "ability-multiplier":
                const { multiplierSpecialRule, multiplierSpecialRuleCheck, multiplierSpecialCount } = players[socketId] || {}
                callback({
                    multiplierSpecialRule,
                    multiplierSpecialRuleCheck,
                    multiplierSpecialCount,
                })
                callback(players[socketId])
                break
            case "cards-in-hand":
                const { inDeck, inHand, inScene, inRubbishBin } = players[socketId] || {}
                callback({
                    inDeck,
                    inHand,
                    inScene,
                    inRubbishBin,
                })
                callback(players[socketId])
                break
            case "w-cards-in-hand":
                const { inDeck_customized_WCard, inDeck_WCard, inScene_WCard, inRubbishBin_WCard } = players[socketId] || {}
                callback({
                    inDeck_customized_WCard,
                    inDeck_WCard,
                    inScene_WCard,
                    inRubbishBin_WCard,
                })
                callback(players[socketId])
                break
            case "all":
                callback(players[socketId])
                break
        }
    })

    socket.on("serverDebugUpdateScores", function (socketId, score, callback) {
        players[socketId].totalScore += score
        callback("Now: " + players[socketId].totalScore)
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
    // 不計小數
    players[player1SocketId].totalScore += Math.floor(players[player1SocketId].extraScore)
    players[player2SocketId].totalScore += Math.floor(players[player2SocketId].extraScore)
    console.log("玩家1額外加分(技能): " + Math.floor(players[player1SocketId].extraScore))
    console.log("玩家2額外加分(技能): " + Math.floor(players[player2SocketId].extraScore))

    // 計分結果
    let whoWinText
    switch (whoWin) {
        case 0:
            whoWinText = "平手!"
            break
        case 1:
            whoWinText = players[player1SocketId].nickname + "勝利!"
            break
        case 2:
            whoWinText = players[player2SocketId].nickname + "勝利!"
            break
    }
    io.to(roomId).emit("setPlayerWinText", whoWinText)

    if (whoWinSocketId === player1SocketId) {
        console.log("玩家1(" + players[player1SocketId].nickname + ")獲得分數: " + baseScore * player1Multiplier)
        players[player1SocketId].totalScore += baseScore * player1Multiplier
        io.to(roomId).emit("setPlayerWinScoreText", players[player1SocketId].totalScore, player1SocketId)
        io.to(roomId).emit("setPlayerLoseScoreText", players[player1SocketId].totalScore, player1SocketId)
    } else if (whoWinSocketId === player2SocketId) {
        console.log("玩家2(" + players[player2SocketId].nickname + ")獲得分數: " + baseScore * player2Multiplier)
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

    console.log(
        `玩家1(${players[player1SocketId].nickname})總分: ${player1ScoreBeforeCalculation} >>> ${players[player1SocketId].totalScore}`
    )
    console.log(
        `玩家2(${players[player2SocketId].nickname})總分: ${player2ScoreBeforeCalculation} >>> ${players[player2SocketId].totalScore}`
    )
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
        // Excel 結算積分
        io.to(player1SocketId).emit("addScoresToExcel", players[player1SocketId].totalScore)
        io.to(player2SocketId).emit("addScoresToExcel", players[player2SocketId].totalScore)
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
        players[endRoundRoom[i]].inSceneElementCalculator = [null, null, null]
        players[endRoundRoom[i]].inSceneIPointCalculator = [null, null, null]
        players[endRoundRoom[i]].inSceneSeriesCalculator = [null, null, null]
        players[endRoundRoom[i]].inSceneRarityCalculator = [null, null, null]
        players[endRoundRoom[i]].inSceneAuthorBoostPt = [0, 0, 0]
        players[endRoundRoom[i]].totalInspriationPt = 0
        players[endRoundRoom[i]].cardCount = 0
        players[endRoundRoom[i]].roundCount++
        players[endRoundRoom[i]].extraScore = 0

        players[endRoundRoom[i]].multiplierSpecialRule = null
        players[endRoundRoom[i]].multiplierSpecialRuleCheck = null
        players[endRoundRoom[i]].multiplierSpecialCount = 1
        players[endRoundRoom[i]].isHCardActive = false

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
        if (players[socketId].multiplierSpecialRule === "sameElement") {
            // multiplierSpecialRuleCheck is a string that pretends to be an array. e.g. "[4,4,4]"
            const realArray = JSON.parse(players[socketId].multiplierSpecialRuleCheck)
            // 24256_W004 莊子: 土屬組合--> 3倍
            if (JSON.stringify(players[socketId].inSceneElementCalculator) === JSON.stringify(realArray)) {
                multiplier = players[socketId].multiplierSpecialCount
            }
            console.log(`玩家${playerNumber}獲得特殊積分倍率(同屬)：${multiplier}倍`)
        }
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
        if (players[socketId].multiplierSpecialRule === "sameSeries") {
            console.log(`玩家${playerNumber}獲得特殊積分倍率(同系列)：${multiplier}倍`)
        }
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
        if (players[socketId].multiplierSpecialRule === "sameIPoint") {
            console.log(`玩家${playerNumber}獲得特殊積分倍率(同靈感值)：${multiplier}倍`)
        }
    }
    // 同屬 + 同靈感值
    if (sameElement && sameIPoint) {
        console.log(`玩家${playerNumber}做出組合：同屬 + 同靈感值`)
        multiplier = 4
    }
    // TODO: 神組合
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
