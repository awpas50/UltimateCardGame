import { ICard_Data_23246, WCard_Data_23246 } from "../scenes/game.js"

export default class InteractiveHandler {
    constructor(scene) {
        // Section: Card preview
        // Create cardPreview on pointerdown

        let isCardPreviewActive = false
        this.cardPreview = null

        scene.input.on("pointerdown", (event, gameObjects) => {
            let pointer = scene.input.activePointer
            // Check if gameObject is defined
            //console.log("isCardPreviewActive: " + isCardPreviewActive);
            // If not clicking anything gameObjects returns empty array, like this....... []
            //console.log(gameObjects);
            if ((gameObjects.length == 0 || gameObjects[0].type === "Zone") && isCardPreviewActive && this.cardPreview !== null) {
                this.cardPreview.setPosition(1250, 400)
                this.isCardPreviewActive = false
            }
            if (!gameObjects || gameObjects.length == 0) {
                return
            }
            if (gameObjects[0].type === "Image" && gameObjects[0].data.list.id !== "cardBack") {
                scene.sound.play("dragCard")
                console.log(gameObjects[0].data)
                if (this.cardPreview === null) {
                    this.cardPreview = scene.add.image(750, 400, gameObjects[0].data.values.sprite).setScale(0.7, 0.7)
                } else {
                    this.cardPreview.setTexture(gameObjects[0].data.values.sprite).setScale(0.7, 0.7)
                    this.cardPreview.setPosition(750, 400)
                }
                let tween = scene.tweens.add({
                    targets: this.cardPreview,
                    x: 465,
                    duration: 100,
                    ease: "Linear",
                    yoyo: false, // Don't yoyo (return to start position) after tween ends
                    repeat: 0,
                })
                isCardPreviewActive = true
                tween.play()
            }
        })

        scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX
            gameObject.y = dragY
        })
        scene.input.on("dragstart", (pointer, gameObject) => {
            gameObject.setTint(0xf0ccde)
            scene.children.bringToTop(gameObject)
        })

        scene.input.on("dragend", (pointer, gameObject, dropped) => {
            gameObject.setTint()
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
        })

        // Card drop
        // 'drop' *** built-in function in Phaser 3
        // gameObject: Card
        scene.input.on("drop", (pointer, gameObject, dropZone) => {
            let canGetPoints = false
            let cardType = ""
            // 是否符合屬性/卡牌類型? 不符合條件時卡牌須反轉, 並不能獲得靈感值
            switch (dropZone.name) {
                case "dropZone1": //天
                    if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerSkyElements.includes(gameObject.getData("element"))
                    ) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else {
                        canGetPoints = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.skyCardZoneName = gameObject.getData("id")
                    break
                case "dropZone2": //地
                    if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerGroundElements.includes(gameObject.getData("element"))
                    ) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else {
                        canGetPoints = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.groundCardZoneName = gameObject.getData("id")
                    break
                case "dropZone3": //人
                    if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerPersonElements.includes(gameObject.getData("element"))
                    ) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else {
                        canGetPoints = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.personCardZoneName = gameObject.getData("id")
                    break
                case "dropZone4": //日
                    if (gameObject.getData("id").includes("I")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "HCard"
                    }
                    scene.GameHandler.sunCardZoneName = gameObject.getData("id")
                    break
            }
            if (cardType === "cardBack") {
                gameObject.setTexture("H001B")
            }
            // 卡牌移動到正確位置
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready" && dropZone.data.list.cards == 0) {
                // 鎖定卡牌位置
                gameObject.x = dropZone.x
                gameObject.y = dropZone.y
                scene.input.setDraggable(gameObject, false)
                // UI
                scene.UIHandler.hideRollDiceText()
                // 音效
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                // 是否能獲得作者屬性加成?
                let authorBuffPts = 0
                let elementID = -1
                // <?> 無屬性能不能獲得作者屬性加成? 待詢問
                if (gameObject.getData("id").includes("I")) {
                    const elementMap = {
                        火: 0,
                        水: 1,
                        木: 2,
                        金: 3,
                        土: 4,
                    }
                    elementID = elementMap[gameObject.getData("element")] ?? -1 // Default to -1 if element not found
                    authorBuffPts = scene.GameHandler.authorBuffs[elementID]
                }
                // 積分倍率計算(同屬雙倍,同靈感三倍)。蓋牌無法獲得積分加倍。-1表示無效積分計算。
                if (gameObject.getData("id").includes("I") && dropZone.name !== "dropZone4") {
                    // socketId, elementId, inspriationPt
                    scene.socket.emit(
                        "serverSetCardType",
                        scene.socket.id,
                        canGetPoints ? elementID : -1,
                        canGetPoints ? gameObject.getData("points") : -1
                    )
                }
                // <?> 計算總得分。卡反轉時能獲得作者屬性加成嗎? 待詢問。
                const totalPointsToUpdate = canGetPoints ? gameObject.getData("points") + authorBuffPts : 0
                // 通知server更新雙方卡牌位置。server再call SocketHandler的cardPlayed。對方能見到你打出手牌。
                scene.socket.emit(
                    "serverNotifyCardPlayed",
                    gameObject.getData("id"),
                    scene.socket.id,
                    dropZone.name,
                    scene.GameHandler.currentRoomID,
                    cardType
                )
                // 通知server再call SocketHandler的calculatePoints。
                scene.socket.emit(
                    "serverUpdatePoints",
                    totalPointsToUpdate,
                    scene.socket.id,
                    dropZone.name,
                    scene.GameHandler.currentRoomID
                )
                scene.socket.emit("serverUpdateCardInHand", scene.socket.id, gameObject.getData("id"), scene.GameHandler.currentRoomID)
                scene.socket.emit("serverUpdateAuthorBuff", scene.socket.id, authorBuffPts)
                dropZone.data.list.cards++
                // 同時檢查比賽是否結束
                scene.socket.emit("serverUpdateCardCount", scene.socket.id, scene.GameHandler.opponentID, scene.GameHandler.currentRoomID)
            } else {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
        })

        //Debug
        scene.input.on("pointerdown", (pointer) => {
            // Get the x and y coordinates of the mouse pointer
            const x = pointer.x
            const y = pointer.y

            // Show the coordinates on the console
            //console.log(`Clicked at X: ${x}, Y: ${y}`);
        })
    }
}
