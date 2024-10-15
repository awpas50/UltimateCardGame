import io from "socket.io-client"

export default class SocketHandler {
    constructor(scene) {
        // Heroku URL
        // Default: localhost:3000 is where the server is.
        scene.socket = io("https://ultimate-card-game-f26046605e38.herokuapp.com")
        // scene.socket = io("http://localhost:3000/")

        //Create or join a room
        scene.socket.on("connect", () => {
            console.log("Connected!")
        })
        scene.socket.on("playersInRoom", (players) => {
            console.log("Players in the room:", players)
            scene.GameHandler.currentPlayersInRoom = players
            scene.GameHandler.opponentID = players.filter((player) => player !== scene.socket.id)
            console.log("opponentID:", scene.GameHandler.opponentID)
        })

        scene.socket.on("setPlayerTurnText", () => {
            let b = scene.GameHandler.getCurrentTurn()
            scene.UIHandler.setPlayerTurnText(b)
        })
        scene.socket.on("buildPlayerPointText", () => {
            scene.UIHandler.buildPlayerPointText()
        })
        scene.socket.on("setPlayerPointText", () => {
            let points = scene.GameHandler.getPlayerTotalPoint()
            scene.UIHandler.setPlayerPointText(points)
        })
        scene.socket.on("buildOpponentPointText", () => {
            scene.UIHandler.buildOpponentPointText()
        })
        scene.socket.on("setOpponentPointText", () => {
            let points = scene.GameHandler.getOpponentTotalPoint()
            scene.UIHandler.setOpponentPointText(points)
        })
        scene.socket.on("buildPlayerNumberText", (playerNumber) => {
            scene.UIHandler.buildPlayerNumberText(playerNumber)
        })
        scene.socket.on("hideRollDiceText", () => {
            scene.UIHandler.hideRollDiceText()
        })
        scene.socket.on("changeGameState", (gameState) => {
            scene.GameHandler.changeGameState(gameState)
            if (gameState === "Initializing") {
                scene.UIHandler.ActivateGameText()
            }
        })
        scene.socket.on("readyToStartGame", (socketId) => {
            // 雙方玩家自動抽卡。其中一方會有延遲，如果指令同時進行可能會有問題
            if (scene.socket.id === socketId) {
                setTimeout(() => {
                    scene.socket.emit(
                        "dealCardsFirstRound",
                        scene.socket.id,
                        scene.GameHandler.currentRoomID,
                        scene.GameHandler.opponentID
                    )
                }, 1000)
            } else {
                scene.socket.emit(
                    "dealCardsFirstRound",
                    scene.socket.id,
                    scene.GameHandler.currentRoomID,
                    scene.GameHandler.opponentID
                )
            }
        })

        scene.socket.on("addICardsHCardsInScene", (socketId, cardIdList) => {
            if (socketId === scene.socket.id) {
                // 玩家: 從server獲得卡ID (cardIdList: Array<string>)，根據卡ID新增卡牌。
                for (let i in cardIdList) {
                    let card
                    if (cardIdList[i].includes("I")) {
                        card = scene.DeckHandler.InstantiateCard(55 + i * 55, 780, "ICard", cardIdList[i], "playerCard").setScale(
                            0.26
                        )
                        console.log(typeof card)
                        console.log(cardIdList[i])
                        scene.CardStorage.inHandStorage.push(card)
                    }
                    if (cardIdList[i].includes("H")) {
                        card = scene.DeckHandler.InstantiateCard(55 + i * 55, 780, "HCard", cardIdList[i], "playerCard").setScale(
                            0.26
                        )
                        console.log(typeof card)
                        console.log(cardIdList[i])
                        scene.CardStorage.inHandStorage.push(card)
                    }
                    // scene.GameHandler.playerHand.push(card)
                    // let testMessage = card.getData('test');
                    // console.log(testMessage); // This should output: "test message"
                }
                // console.log(scene.GameHandler.playerHand)
            } else {
                // 對手: 只會看到卡背
                for (let i in cardIdList) {
                    let card = scene.DeckHandler.InstantiateCard(85 + i * 35, 0, "cardBack", "cardBack", "opponentCard").setScale(
                        0.26
                    )
                    scene.CardStorage.opponentCardBackStorage.push(card)
                }
            }
        })

        scene.socket.on("deleteOneCardInHand", (socketId, cardIdToRemove) => {
            const fromArray = scene.CardStorage.inHandStorage
            const toArray = scene.CardStorage.inSceneStorage
            const isPlayer = socketId === scene.socket.id
            if (isPlayer) {
                fromArray.forEach((item) => console.log(item))
                scene.CardStorage.changeCardToAnotherStorage(cardIdToRemove, fromArray, toArray)
            } else {
                // scene.CardStorage.opponentCardBackStorage.shift().destroy()
            }
            //scene.GameHandler.playerHand[2].destroy()
        })
        // * cardId: string * //
        scene.socket.on("dealOneCardInHand", (socketId, cardId, index) => {
            if (socketId === scene.socket.id) {
                const cardType = cardId.includes("I") ? "ICard" : cardId.includes("H") ? "HCard" : null

                if (cardType) {
                    const card = scene.DeckHandler.InstantiateCard(55 + index * 55, 780, cardType, cardId, "playerCard").setScale(
                        0.26
                    )
                    scene.CardStorage.inHandStorage.push(card)
                }
                // scene.GameHandler.playerHand.push(card)
            } else {
                // let card = scene.DeckHandler.InstantiateCard(85 + index * 35, 0, "cardBack", "cardBack", "opponentCard").setScale(
                //     0.26
                // )
                // scene.CardStorage.opponentCardBackStorage.push(card)
            }
        })

        scene.socket.on("addWCardsInScene", (socketId, cardId) => {
            const isPlayer = socketId === scene.socket.id
            const newCard = scene.DeckHandler.InstantiateCard(189, isPlayer ? 585 : 230, "WCard", cardId, "authorCard").setScale(
                0.26,
                isPlayer ? 0.26 : -0.26
            )

            if (isPlayer) {
                scene.CardStorage.wCardStorage.push(newCard)
            } else {
                scene.CardStorage.opponentCardStorage.push(newCard)
            }
        })

        scene.socket.on("setAuthorElements", (authorCardName) => {
            //Author card
            scene.GameHandler.setAuthorElements(authorCardName) //Player side
            scene.GameHandler.setAuthorBuffs(authorCardName) //Player side
        })
        scene.socket.on("setAuthorRarity", (socketId, authorCardName) => {
            //Author card
            if (socketId === scene.socket.id) {
                scene.GameHandler.setPlayerAuthorRarity(authorCardName) //Player side
                console.log("playerAuthorRarity: " + scene.GameHandler.playerAuthorRarity)
            } else {
                scene.GameHandler.setOpponentAuthorRarity(authorCardName) //Opponent side
                console.log("opponentAuthorRarity: " + scene.GameHandler.opponentAuthorRarity)
            }
        })
        scene.socket.on("RollDice", (socketId, roll1, roll2) => {
            const [playerDiceValue, opponentDiceValue] = socketId === scene.socket.id ? [roll1, roll2] : [roll2, roll1]

            // Display the results
            console.log("playerDiceValue: " + playerDiceValue)
            console.log("opponentDiceValue: " + opponentDiceValue)

            // Update GameHandler with the determined values
            scene.GameHandler.playerDiceValue = playerDiceValue
            scene.GameHandler.opponentDiceValue = opponentDiceValue
        })

        scene.socket.on("decideWhichPlayerfirstTurn", (socketId, roll1, roll2) => {
            const { playerAuthorRarity, opponentAuthorRarity, playerDiceValue, opponentDiceValue } = scene.GameHandler
            if (
                // 1. 等級較高
                playerAuthorRarity > opponentAuthorRarity ||
                // 2. 等級一樣但擲骰勝利時成為先手
                (playerAuthorRarity === opponentAuthorRarity && playerDiceValue > opponentDiceValue)
            ) {
                scene.GameHandler.changeTurn()
                scene.GameHandler.getCurrentTurn()
            }

            // 如果是玩家2 顯示數字需要反轉
            if (playerAuthorRarity === opponentAuthorRarity) {
                scene.UIHandler.setRollDiceText(
                    socketId === scene.socket.id ? roll1 : roll2,
                    socketId === scene.socket.id ? roll2 : roll1
                )
            }
        })

        // Called in server.js
        // Where does Player 2 cards display in Player 1 scene??
        // * cardName: String, socketId: string, dropZoneName: string, cardType: ICard/Wcard/HCard * //
        scene.socket.on("localInstantiateOpponentCard", (cardName, socketId, dropZoneName, cardType) => {
            console.log(
                "cardName: " + cardName + " socketId:" + socketId + " dropZoneID:" + dropZoneName + " cardType: " + cardType
            )
            if (socketId !== scene.socket.id) {
                // scene.CardStorage.opponentCardBackStorage.shift().destroy()
                const scaleX = 0.26
                const scaleY = cardType === "cardBack" ? 0.26 : -0.26
                let gameObject
                switch (dropZoneName) {
                    case "dropZone1": //天
                        gameObject = scene.DeckHandler.InstantiateCard(189, 345, cardType, cardName, "opponentCard").setScale(
                            scaleX,
                            scaleY
                        )
                        break
                    case "dropZone2": //地
                        gameObject = scene.DeckHandler.InstantiateCard(90, 220, cardType, cardName, "opponentCard").setScale(
                            scaleX,
                            scaleY
                        )
                        break
                    case "dropZone3": //人
                        gameObject = scene.DeckHandler.InstantiateCard(280, 220, cardType, cardName, "opponentCard").setScale(
                            scaleX,
                            scaleY
                        )
                        break
                    case "dropZone4": //日
                        gameObject = scene.DeckHandler.InstantiateCard(189, 100, cardType, cardName, "opponentCard").setScale(
                            scaleX,
                            scaleY
                        )
                        break
                }

                scene.CardStorage.opponentCardStorage.push(gameObject)
            }
        })
        // * pointsString: String, socketId: string, dropZoneName: string * //
        scene.socket.on("calculatePoints", (pointsString, socketId, dropZoneName) => {
            let points = parseInt(pointsString)
            if (socketId === scene.socket.id) {
                switch (dropZoneName) {
                    case "dropZone1": //天
                        scene.GameHandler.setPlayerSkyPoint(points)
                        break
                    case "dropZone2": //地
                        scene.GameHandler.setPlayerGroundPoint(points)
                        break
                    case "dropZone3": //人
                        scene.GameHandler.setPlayerPersonPoint(points)
                        break
                    default:
                        break
                }
            } else {
                switch (dropZoneName) {
                    case "dropZone1": //天
                        scene.GameHandler.setOpponentSkyPoint(points)
                        break
                    case "dropZone2": //地
                        scene.GameHandler.setOpponentGroundPoint(points)
                        break
                    case "dropZone3": //人
                        scene.GameHandler.setOpponentPersonPoint(points)
                        break
                    default:
                        break
                }
            }
            scene.GameHandler.setPlayerTotalPoint()
            scene.GameHandler.setOpponentTotalPoint()
            console.log(
                "Player: " + scene.GameHandler.playerTotalPoints + " " + "Opponent: " + scene.GameHandler.opponentTotalPoints
            )
        })

        scene.socket.on("changeTurn", () => {
            scene.GameHandler.changeTurn()
            scene.GameHandler.getCurrentTurn()
        })

        scene.socket.on("setPlayerWinText", (whoWin) => {
            scene.UIHandler.BuildWhoWinText(whoWin)
        })

        scene.socket.on("setPlayerWinScoreText", (scores, whoWinSocketId) => {
            if (whoWinSocketId === scene.socket.id) {
                scene.GameHandler.playerTotalWinScore = scores
            }
            scene.UIHandler.SetPlayerWinScoreText(scene.GameHandler.playerTotalWinScore)
        })

        scene.socket.on("clearLocalBattleField", () => {
            console.log("clearLocalBattleField")
            // Destroy objects in all storage arrays
            scene.CardStorage.inSceneStorage.forEach((object) => {
                if (object && object.destroy) {
                    object.destroy()
                }
            })
            scene.CardStorage.wCardStorage.forEach((object) => {
                if (object && object.destroy) {
                    object.destroy()
                }
            })
            scene.CardStorage.opponentCardStorage.forEach((object) => {
                if (object && object.destroy) {
                    object.destroy()
                }
            })
            // Clear dropZone
            console.log(scene.ZoneHandler.dropZoneList)
            for (let i = 0; i < scene.ZoneHandler.dropZoneList.length; i++) {
                scene.ZoneHandler.dropZoneList[i].data.list.cards = 0
            }
            // Clear i points
            scene.GameHandler.setPlayerSkyPoint(0)
            scene.GameHandler.setPlayerGroundPoint(0)
            scene.GameHandler.setPlayerPersonPoint(0)
            scene.GameHandler.setOpponentSkyPoint(0)
            scene.GameHandler.setOpponentGroundPoint(0)
            scene.GameHandler.setOpponentPersonPoint(0)
            // UI
            scene.UIHandler.deleteWhoWinText()
            scene.UIHandler.setPlayerPointText()
            scene.UIHandler.setOpponentPointText()

            scene.socket.emit("dealCardsAnotherRound", scene.socket.id, scene.GameHandler.currentRoomID)
        })
    }
}
