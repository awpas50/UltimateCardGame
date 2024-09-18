import Color from "./Color"
import PositionHandler from "./PositionHandler"

export default class UIHandler {
    constructor(scene) {
        this.inputText = {}
        // <------------------------------------ Zone ------------------------------------>
        this.buildZones = () => {
            PositionHandler.dropZoneConfigs.forEach((config) => {
                let dropZone = scene.ZoneHandler.renderZone(config.x, config.y, config.width, config.height)
                dropZone.setName(config.name)
                scene.ZoneHandler.dropZoneList.push(dropZone)
            })
            console.log(scene.ZoneHandler.dropZoneList)
        }
        this.buildZoneOutline = () => {
            scene.ZoneHandler.renderOutlineGrid(
                PositionHandler.outlineGrid.x,
                PositionHandler.outlineGrid.y,
                PositionHandler.outlineGrid.width,
                PositionHandler.outlineGrid.height
            )
        }
        this.buildPlayerAreas = () => {
            const createStyledRectangle = (scene, config, strokeColor) => {
                const rect = scene.add.rectangle(config.x, config.y, config.width, config.height)
                rect.setStrokeStyle(4, strokeColor)
                return rect
            }

            scene.playerHandArea = createStyledRectangle(PositionHandler.playerHandArea, Color.hotPink)
            scene.playerDeckArea = createStyledRectangle(PositionHandler.playerDeckArea, Color.cyan)
            scene.playerRubbishBinArea = createStyledRectangle(PositionHandler.playerRubbishBinArea, Color.cyan)

            scene.opponentHandArea = createStyledRectangle(PositionHandler.opponentHandArea, Color.hotPink)
            scene.opponentDeckArea = createStyledRectangle(PositionHandler.opponentDeckArea, Color.cyan)
            scene.opponentRubbishBinArea = createStyledRectangle(PositionHandler.opponentRubbishBinArea, Color.cyan)
        }
        // <------------------------------------ Room number (top right) ------------------------------------>
        this.buildPlayerNumberText = (playerNumber) => {
            scene.playerNumberText = scene.add
                .text(PositionHandler.playerNumberText.x, PositionHandler.playerNumberText.y, "你是: 玩家 ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
            if (playerNumber == 1) {
                scene.playerNumberText.text = "你是: 玩家1"
            } else {
                scene.playerNumberText.text = "你是: 玩家2"
            }
        }
        // <------------------------------------ Player turn ------------------------------------>
        this.buildPlayerTurnText = () => {
            scene.playerTurnText = scene.add
                .text(PositionHandler.playerTurnText.x, PositionHandler.playerTurnText.y, "等待另一位玩家入場...")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
        }
        this.setPlayerTurnText = (b) => {
            if (b === true) {
                scene.playerTurnText.text = "你的回合"
            } else {
                scene.playerTurnText.text = "對方的回合"
            }
        }
        // <------------------------------------ Inpsriation points ------------------------------------>
        this.buildPlayerPointText = () => {
            scene.playerPointText = scene.add
                .text(PositionHandler.playerPointText.x, PositionHandler.opponentPointText.y, " ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
        }
        this.buildOpponentPointText = () => {
            scene.opponentPointText = scene.add
                .text(PositionHandler.opponentPointText.x, PositionHandler.opponentPointText.y, " ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
        }
        this.setPlayerPointText = (points) => {
            scene.playerPointText.text = "靈感值:" + points
        }
        this.setOpponentPointText = (points) => {
            scene.opponentPointText.text = "對方靈感值:" + points
        }
        // <------------------------------------ Points (60 to win) ------------------------------------>
        this.BuildWhoWinText = (whoWin) => {
            const messages = {
                1: "玩家1勝利!",
                2: "玩家2勝利!",
                0: "平手!",
            }

            scene.whoWinText = scene.add.text(PositionHandler.whoWinText.x, PositionHandler.whoWinText.y, messages[whoWin], {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
        }
        this.deleteWhoWinText = () => {
            scene.whoWinText.destroy()
        }
        this.buildPlayerWinScoreText = () => {
            scene.winScoreText = scene.add.text(PositionHandler.winScoreText.x, PositionHandler.winScoreText.y, "", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
        }
        this.SetPlayerWinScoreText = (totalWinScore) => {
            scene.winScoreText.text = "總分: " + totalWinScore
        }
        this.ActivateGameText = () => {
            if (scene.dealCardText != undefined || scene.dealCardText != null) {
                scene.dealCardText.setInteractive()
                scene.dealCardText.setColor("#00ffff")
            }
        }
        // <------------------------------------ Roll Dice ------------------------------------>
        this.buildRollDiceText = () => {
            scene.rollDiceText1 = scene.add
                .text(PositionHandler.rollDiceText1.x, PositionHandler.rollDiceText1.y, " ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
            scene.rollDiceText2 = scene.add
                .text(PositionHandler.rollDiceText2.x, PositionHandler.rollDiceText2.y, " ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
        }
        this.setRollDiceText = (num1, num2) => {
            scene.rollDiceText1.text = "你擲出:" + num1
            scene.rollDiceText2.text = "對手擲出:" + num2
        }
        this.hideRollDiceText = () => {
            scene.rollDiceText1.text = ""
            scene.rollDiceText2.text = ""
        }
        // <------------------------------------ Room ------------------------------------>
        this.buildRoomNumberText = () => {
            scene.roomNumberText = scene.add
                .text(PositionHandler.roomNumberText.x, PositionHandler.roomNumberText.y, "房間編號: ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
        }
        this.buildCreateRoomText = () => {
            scene.createRoomText = scene.add.text(
                PositionHandler.createRoomText.x,
                PositionHandler.createRoomText.y,
                "建立房間",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#00ffff",
                }
            )
            scene.createRoomText.setInteractive()
            scene.createRoomText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                this.buildPlayArea()
                let randomRoomId = this.generateRandomRoomID()
                scene.socket.emit("createRoom", randomRoomId)
                scene.createRoomText.visible = false
                scene.joinRoomText.visible = false
                scene.GameHandler.currentRoomID = randomRoomId
                scene.roomNumberText.text = "房間編號: " + randomRoomId
                this.inputText.visible = false
                this.hideInputTextDecoration()
            })
            // Card color
            scene.createRoomText.on("pointerover", () => {
                scene.createRoomText.setColor("#fff5fa")
            })
            scene.createRoomText.on("pointerout", () => {
                scene.createRoomText.setColor("#00ffff")
            })
        }
        scene.socket.on("joinRoomSucceedSignal", () => {
            this.buildPlayArea()
            scene.createRoomText.disableInteractive()
            scene.joinRoomText.disableInteractive()
            scene.roomNumberText.text = "房間編號: " + this.getInputTextContent(this.inputText)

            scene.GameHandler.currentRoomID = this.getInputTextContent(this.inputText)
            console.log("Current Room ID: " + scene.GameHandler.currentRoomID)
            // scene.socket.emit("dealDeck", scene.socket.id, scene.GameHandler.currentRoomID)

            scene.createRoomText.visible = false
            scene.joinRoomText.visible = false
            this.inputText.destroy()
            this.hideInputTextDecoration()
        })
        this.buildJoinRoomText = () => {
            scene.joinRoomText = scene.add.text(PositionHandler.joinRoomText.x, PositionHandler.joinRoomText.y, "加入房間", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
            scene.joinRoomText.setInteractive()
            scene.joinRoomText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.socket.emit("joinRoom", this.getInputTextContent(this.inputText))
                // (Runs joinRoomSucceedSignal from server.js if success.)
                // (Update: Also runs dealCardsFirstRound (in server) for both players)
            })
            // Card color
            scene.joinRoomText.on("pointerover", () => {
                scene.joinRoomText.setColor("#fff5fa")
            })
            scene.joinRoomText.on("pointerout", () => {
                scene.joinRoomText.setColor("#00ffff")
            })
        }

        // Main
        this.buildPlayArea = () => {
            this.buildZones()
            this.buildZoneOutline()
            this.buildPlayerAreas()
            this.buildPlayerTurnText()
            this.buildRollDiceText()
            this.buildPlayerWinScoreText()
        }
        this.buildLobby = () => {
            this.buildInputTextDecoration()
            this.buildRoomNumberText()
            this.buildCreateRoomText()
            this.buildJoinRoomText()
        }
        // Main
        this.buildInputTextField = (inputText) => {
            inputText = scene.add.text(PositionHandler.inputText.x, PositionHandler.inputText.y, "", {
                fixedWidth: 150,
                fixedHeight: 36,
            })
            inputText.setOrigin(0.5, 0.5)
            inputText.setInteractive().on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                const editor = scene.rexUI.edit(inputText)
                const elem = editor.inputText.node
                elem.style.top = "-10px"
            })
            return inputText
        }
        this.getInputTextContent = (inputText) => {
            return inputText.text
        }
        this.buildInputTextDecoration = () => {
            scene.inputTextRectangle = scene.rexUI.add.roundRectangle(
                PositionHandler.inputTextRectangle.x,
                PositionHandler.inputTextRectangle.y,
                100,
                30,
                0,
                0x666666
            )
        }
        this.hideInputTextDecoration = () => {
            scene.inputTextRectangle.setFillStyle(0x000000)
        }
        this.generateRandomRoomID = () => {
            // Generate a random number between 0 and 999999 (inclusive)
            const randomNumber = Math.floor(Math.random() * 1000000)

            // Convert the number to a string and pad it with leading zeros if needed
            const randomNumberString = randomNumber.toString().padStart(6, "0")

            return randomNumberString
        }
    }
}
