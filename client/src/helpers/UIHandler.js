import Color from "./Color"
import ScaleHandler from "./ScaleHandler.js"
import PositionHandler from "./PositionHandler"

export default class UIHandler {
    constructor(scene) {
        this.accountInfo = []
        this.loginInputText = {}
        this.inputText = {}
        // <------------------------------------ Zone ------------------------------------>
        this.buildZones = () => {
            PositionHandler.dropZoneConfigs.forEach((config) => {
                let dropZone = scene.ZoneHandler.renderZone(config.x, config.y, config.width, config.height)
                dropZone.setName(config.name)
                scene.ZoneHandler.dropZoneList.push(dropZone)
            })
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
            const createStyledRectangle = (config, strokeColor) => {
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
        this.buildPlayerNumberText = (playerNumber, nickname) => {
            scene.playerNumberText = scene.add
                .text(PositionHandler.playerNumberText.x, PositionHandler.playerNumberText.y, "你是: 玩家 ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
            scene.playerNumberText.text = "你是: " + nickname
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
                scene.playerTurnText.text = scene.registry.get("nickname") + "的回合"
            } else {
                scene.playerTurnText.text = scene.registry.get("opponentNickname") + "的回合"
            }
        }
        // <------------------------------------ Inpsriation points ------------------------------------>
        this.buildPlayerPointText = () => {
            scene.playerPointText = scene.add
                .text(PositionHandler.playerPointText.x, PositionHandler.playerPointText.y, " ")
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
        this.BuildWhoWinText = (whoWinText) => {
            scene.whoWinText = scene.add.text(PositionHandler.whoWinText.x, PositionHandler.whoWinText.y, whoWinText, {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
        }
        this.deleteWhoWinText = () => {
            scene.whoWinText.destroy()
        }
        this.buildOpponentWinScoreText = () => {
            scene.opponentWinScoreText = scene.add.text(
                PositionHandler.opponentWinScoreText.x,
                PositionHandler.opponentWinScoreText.y,
                "總分: 0",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#00ffff",
                }
            )
        }
        this.setOpponentWinScoreText = (totalWinScore) => {
            scene.opponentWinScoreText.text = "總分: " + totalWinScore
        }
        this.buildPlayerWinScoreText = () => {
            scene.playerWinScoreText = scene.add.text(
                PositionHandler.playerWinScoreText.x,
                PositionHandler.playerWinScoreText.y,
                "總分: 0",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#00ffff",
                }
            )
        }
        this.setPlayerWinScoreText = (totalWinScore) => {
            scene.playerWinScoreText.text = "總分: " + totalWinScore
        }
        // this.ActivateGameText = () => {
        //     if (scene.dealCardText != undefined || scene.dealCardText != null) {
        //         scene.dealCardText.setInteractive()
        //         scene.dealCardText.setColor("#00ffff")
        //     }
        // }
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
            scene.roomNumberText.setInteractive()
            scene.roomNumberText.on("pointerdown", () => {
                navigator.clipboard
                    .writeText(scene.GameHandler.currentRoomID)
                    .then(() => {
                        scene.Toast.showToast("已複製房間編號: " + scene.GameHandler.currentRoomID) // Optional feedback for the user
                    })
                    .catch((err) => {
                        console.error("Error copying text: ", err)
                    })
            })
        }
        this.buildScoreBoardText = () => {
            scene.scoreBoardText = scene.add.text(PositionHandler.scoreBoardText.x, PositionHandler.scoreBoardText.y, "排行榜", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
            scene.scoreBoardText.setInteractive()
            scene.scoreBoardText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.scene.sleep("Game")
                scene.scene.launch("ScoreBoard")
            })
            scene.scoreBoardText.on("pointerover", () => {
                scene.scoreBoardText.setColor("#fff5fa")
            })
            scene.scoreBoardText.on("pointerout", () => {
                scene.scoreBoardText.setColor("#00ffff")
            })
        }
        this.buildAuthorDeckEditText = () => {
            scene.authorDeckEditText = scene.add.text(
                PositionHandler.authorDeckEditText.x,
                PositionHandler.authorDeckEditText.y,
                "角色卡編成",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#00ffff",
                }
            )
            scene.authorDeckEditText.setInteractive()
            scene.authorDeckEditText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                // ---- To be merged ---------
                // scene.authorDeckEditText.visible = false
                // scene.createRoomText.visible = false
                // scene.joinRoomText.visible = false
                // this.inputText.visible = false
                // this.hideInputTextDecoration()

                scene.scene.sleep("Game")
                scene.scene.launch("AuthorCardEdit")
                // ---------------------------
            })
            // Card color
            scene.authorDeckEditText.on("pointerover", () => {
                scene.authorDeckEditText.setColor("#fff5fa")
            })
            scene.authorDeckEditText.on("pointerout", () => {
                scene.authorDeckEditText.setColor("#00ffff")
            })
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
                const storedAuthorDeck = scene.registry.get("authorDeck")
                if (storedAuthorDeck) {
                    const myDeck = JSON.parse(storedAuthorDeck)
                    scene.socket.emit("serverUpdateAuthorDeck", scene.socket.id, myDeck)
                }
                setTimeout(
                    () => {
                        const RNG = Math.floor(Math.random() * 3) + 1
                        scene.sound.play(`flipCard${RNG}`)
                        this.buildPlayArea()
                        scene.GameHandler.currentRoomID = this.generateRandomRoomID()
                        const randomRoomId = scene.GameHandler.currentRoomID
                        scene.socket.emit("createRoom", randomRoomId)
                        scene.authorDeckEditText.visible = false
                        scene.createRoomText.visible = false
                        scene.joinRoomText.visible = false
                        scene.roomNumberText.text = "房間編號: " + randomRoomId
                        this.inputText.visible = false
                        this.hideInputTextDecoration()
                    },
                    storedAuthorDeck ? 500 : 0
                )
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
            // scene.socket.emit("dealDeck", scene.socket.id, scene.GameHandler.currentRoomID)
            scene.authorDeckEditText.visible = false
            scene.createRoomText.visible = false
            scene.joinRoomText.visible = false
            this.inputText.destroy()
            this.hideInputTextDecoration()
        })
        scene.socket.on("joinRoomFailedSignal", () => {
            scene.Toast.showToast("房間不存在!")
        })
        scene.socket.on("joinRoomFullSignal", () => {
            scene.Toast.showToast("房間已滿!")
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
                const storedAuthorDeck = scene.registry.get("authorDeck")
                if (storedAuthorDeck) {
                    const myDeck = JSON.parse(storedAuthorDeck)
                    scene.socket.emit("serverUpdateAuthorDeck", scene.socket.id, myDeck)
                }

                if (storedAuthorDeck) {
                    setTimeout(() => {
                        scene.socket.emit("joinRoom", this.getInputTextContent(this.inputText))
                    }, 1000)
                } else {
                    scene.socket.emit("joinRoom", this.getInputTextContent(this.inputText))
                }

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

        this.buildLoginSection = () => {
            fetch(`${scene.SocketHandler.domain}/api/get-sheet-data?range=帳號!A2:D200`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    this.accountInfo = data
                    this.loginInputText = this.buildLoginInputTextField(this.loginInputText)
                    this.buildLoginText()
                    this.buildLoginInputTextDecoration()
                    this.buildLoginPreviewImage()
                })
                .catch((error) => {
                    console.error("Error:", error)
                    scene.Toast.showPermanentToast("發生錯誤,請重新載入")
                })
        }
        this.hideLoginSection = () => {
            scene.loginAccountText.visible = false
            scene.loginText.visible = false
            this.loginInputText.destroy()
            this.loginPreview.destroy()
            this.hideLoginInputTextDecoration()
        }
        // Main
        this.buildPlayArea = () => {
            this.buildZones()
            this.buildZoneOutline()
            this.buildPlayerAreas()
            this.buildPlayerTurnText()
            this.buildRollDiceText()
            this.buildPlayerWinScoreText()
            this.buildOpponentWinScoreText()
        }
        this.buildLobby = () => {
            this.buildInputTextDecoration()
            this.buildScoreBoardText()
            this.buildAuthorDeckEditText()
            this.buildRoomNumberText()
            this.buildCreateRoomText()
            this.buildJoinRoomText()
        }
        // <------------------------------------ Login Field Start ------------------------------------>
        this.buildLoginText = () => {
            scene.loginAccountText = scene.add.text(
                PositionHandler.loginAccountText.x,
                PositionHandler.loginAccountText.y,
                "帳號",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#ffffff",
                }
            )
            scene.loginText = scene.add.text(PositionHandler.loginText.x, PositionHandler.loginText.y, "登入", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
            scene.loginText.setInteractive()
            scene.loginText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                const USERNAME = this.getInputTextContent(this.loginInputText)
                console.log("Input: " + USERNAME)
                const result = this.accountInfo.find((arr) => arr[0] === USERNAME)
                if (result) {
                    this.hideLoginSection()
                    this.inputText = this.buildInputTextField(this.inputText)

                    console.log("Username:", result[0])
                    console.log("nickname:", result[1])
                    console.log("Corresponding value:", result[2])
                    console.log("Unique ID:", this.accountInfo.findIndex((arr) => arr[0] === USERNAME) || "-1")
                    console.log("Total score:", result[3] || 0)

                    scene.registry.set("username", result[0])
                    scene.registry.set("nickname", result[1])
                    scene.registry.set("accountAuthorDeck", result[2])
                    scene.registry.set("totalScore", result[3] !== undefined ? result[3] : "0")
                    scene.registry.set(
                        "uniqueId",
                        this.accountInfo.findIndex((arr) => arr[0] === USERNAME)
                    )
                    scene.socket.emit("serverSetNickname", scene.socket.id, result[1])
                    scene.Toast.showTopToast(`歡迎歸來，${result[1]}`)
                    this.buildLobby()
                } else {
                    scene.Toast.showToast("登入失敗")
                }
            })
            // Card color
            scene.loginText.on("pointerover", () => {
                scene.loginText.setColor("#fff5fa")
            })
            scene.loginText.on("pointerout", () => {
                scene.loginText.setColor("#00ffff")
            })
        }
        this.buildLoginInputTextField = (inputText) => {
            inputText = scene.add.text(PositionHandler.loginInputText.x, PositionHandler.loginInputText.y, "", {
                fixedWidth: 200,
                fixedHeight: 36,
            })
            inputText.setDepth(10)
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
        this.buildLoginInputTextDecoration = () => {
            scene.loginInputTextRectangle = scene.rexUI.add.roundRectangle(
                PositionHandler.loginInputTextRectangle.x,
                PositionHandler.loginInputTextRectangle.y,
                150,
                30,
                0,
                Color.dimGrey
            )
        }
        this.hideLoginInputTextDecoration = () => {
            scene.loginInputTextRectangle.setFillStyle(Color.black)
        }
        this.buildLoginPreviewImage = () => {
            this.loginPreview = scene.add
                .image(PositionHandler.loginPreviewImage.x, PositionHandler.loginPreviewImage.y, "24256_W050")
                .setScale(ScaleHandler.loginPreview.scale)
        }

        // <------------------------------------ Login Field Ends ------------------------------------>

        // <------------------------------------ Room Input Field ------------------------------------>
        this.buildInputTextField = (inputText) => {
            inputText = scene.add.text(PositionHandler.inputText.x, PositionHandler.inputText.y, "", {
                fixedWidth: 150,
                fixedHeight: 36,
            })
            inputText.setDepth(10)
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
        this.buildInputTextDecoration = () => {
            scene.inputTextRectangle = scene.rexUI.add.roundRectangle(
                PositionHandler.inputTextRectangle.x,
                PositionHandler.inputTextRectangle.y,
                100,
                30,
                0,
                Color.dimGrey
            )
        }
        this.hideInputTextDecoration = () => {
            scene.inputTextRectangle.setFillStyle(Color.black)
        }
        // <------------------------------------ Room Input Field Ends ------------------------------------>
        this.generateRandomRoomID = () => {
            // Generate a random number between 0 and 999999 (inclusive)
            const randomNumber = Math.floor(Math.random() * 1000000)

            // Convert the number to a string and pad it with leading zeros if needed
            const randomNumberString = randomNumber.toString().padStart(6, "0")

            return randomNumberString
        }
        // <------------------------------------ Generic ------------------------------------>
        this.getInputTextContent = (inputText) => {
            return inputText.text
        }
    }
}
