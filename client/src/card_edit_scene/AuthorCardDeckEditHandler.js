import Color from "../helpers/Color"
import PositionHandler from "../helpers/PositionHandler"
import { WCard_Data_24256 } from "../scenes/game.js"

export default class AuthorCardDeckEditHandler {
    constructor(scene) {
        this.authorDeck = ["", "", "", "", ""]
        this.currentRarity = 0
        this.maxRarity = 12
        this.initUI = () => {
            this.renderZone(90, 330, 330 / 3.25, 430 / 3.25, "authorZone1")
            this.renderZone(195, 330, 330 / 3.25, 430 / 3.25, "authorZone2")
            this.renderZone(300, 330, 330 / 3.25, 430 / 3.25, "authorZone3")
            this.renderZone(405, 330, 330 / 3.25, 430 / 3.25, "authorZone4")
            this.renderZone(510, 330, 330 / 3.25, 430 / 3.25, "authorZone5")
            this.renderOutlineGrid(40, 260, PositionHandler.outlineGrid.width, PositionHandler.outlineGrid.height)
            this.buildSaveAndQuitText()
            this.buildAuthorCardEditInfoText()
            this.generateWCards()
        }

        this.renderZone = (x, y, width, height, name) => {
            let dropZone = scene.add.zone(x, y, width, height).setRectangleDropZone(width, height)
            dropZone.setData({
                cards: 0,
            })
            dropZone.setName(name)
        }

        this.renderOutlineGrid = (x, y, width, height) => {
            const gap = 10
            const rectWidth = width / 4
            const rectHeight = height / 4

            for (let i = 0; i < 5; i++) {
                let dropZoneOutline = scene.add.graphics()
                dropZoneOutline.lineStyle(4, Color.hotPink)

                // Calculate the position for each rectangle in the grid
                const xPos = x + i * (rectWidth + gap)
                const yPos = y

                // Draw the stroke rectangle at the calculated position with smaller dimensions
                dropZoneOutline.strokeRect(xPos, yPos, rectWidth, rectHeight)
            }
        }

        this.buildSaveAndQuitText = () => {
            scene.buildSaveText = scene.add.text(
                PositionHandler.authorCardEditSaveText.x,
                PositionHandler.authorCardEditSaveText.y,
                "儲存",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: this.areAllAuthorCardsPlaced() ? "#00ffff" : "#fff5fa",
                }
            )
            scene.buildSaveText.disableInteractive()
            scene.buildSaveText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.scene.wake("Game")
                scene.scene.get("Game").sys.setVisible(true)
                scene.scene.get("Game").sys.setActive(true)
                scene.scene.stop("AuthorCardEdit")
                this.areAllAuthorCardsPlaced()
                    ? localStorage.setItem("authorDeck", JSON.stringify(this.authorDeck))
                    : localStorage.removeItem("authorDeck")
            })

            scene.buildSaveText.on("pointerover", () => {
                if (this.areAllAuthorCardsPlaced()) scene.buildSaveText.setColor("#fff5fa")
            })
            scene.buildSaveText.on("pointerout", () => {
                if (this.areAllAuthorCardsPlaced()) scene.buildSaveText.setColor("#00ffff")
            })

            scene.buildQuitText = scene.add.text(
                PositionHandler.authorCardEditQuitText.x,
                PositionHandler.authorCardEditQuitText.y,
                "退出 (放棄編成)",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#00ffff",
                }
            )
            scene.buildQuitText.setInteractive()
            scene.buildQuitText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.scene.wake("Game")
                scene.scene.get("Game").sys.setVisible(true)
                scene.scene.get("Game").sys.setActive(true)
                scene.scene.stop("AuthorCardEdit")
            })

            scene.buildQuitText.on("pointerover", () => {
                scene.buildQuitText.setColor("#fff5fa")
            })
            scene.buildQuitText.on("pointerout", () => {
                scene.buildQuitText.setColor("#00ffff")
            })
        }

        this.buildAuthorCardEditInfoText = () => {
            scene.authorCardEditInfoText1 = scene.add.text(
                PositionHandler.authorCardEditInfo1.x,
                PositionHandler.authorCardEditInfo1.y,
                "作者卡將按順序從左到右登場。下方五格都必須放入作者卡，",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                }
            )
            scene.authorCardEditInfoText2 = scene.add.text(
                PositionHandler.authorCardEditInfo2.x,
                PositionHandler.authorCardEditInfo2.y,
                "否則不允許儲存卡組。",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                }
            )
            scene.authorCardEditInfoText3 = scene.add.text(
                PositionHandler.authorCardEditInfo3.x,
                PositionHandler.authorCardEditInfo3.y,
                "LV: 0 / 12",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                }
            )
        }

        this.generateWCards = () => {
            const maxCardsInRow = 5
            const totalCards = 21
            let wCardId
            let counter = 0

            for (let i = 0; i < totalCards; i++) {
                counter++
                wCardId = counter >= 0 && counter <= 9 ? "0" + counter : counter
                const x = 80 + (i % maxCardsInRow) * 110
                const y = 500 + Math.floor(i / maxCardsInRow) * 100

                const card = scene.add
                    .image(x, y, "24256_W0" + wCardId)
                    .setInteractive()
                    .setScale(0.26, 0.26)
                    .setData({
                        id: "24256_W0" + wCardId,
                        rarity: WCard_Data_24256["24256_W0" + wCardId].rarity,
                        zIndex: i,
                    })
                    .setDepth(i)

                scene.input.setDraggable(card)

                // Optional: If you want to handle drag events
                card.on("drag", (pointer, dragX, dragY) => {
                    card.x = dragX
                    card.y = dragY
                    card.setScale(0.8, 0.8)
                })
                card.on("dragstart", () => {
                    scene.children.bringToTop(card)
                })
                card.on("dragend", () => {
                    card.setScale(0.26, 0.26)
                    card.setDepth(card.getData("zIndex"))
                })
            }
        }

        scene.input.on("pointerdown", (pointer) => {
            // Get the x and y coordinates of the mouse pointer
            const x = pointer.x
            const y = pointer.y

            // Show the coordinates on the console
            console.log(`Clicked at X: ${Math.round(x)}, Y: ${Math.round(y)}`)
        })

        scene.input.on("drop", (pointer, gameObject, dropZone) => {
            if (dropZone.data.list.cards !== 0) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            } else if (this.currentRarity + gameObject.getData("rarity") > this.maxRarity) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
                scene.Toast.showToast("作者卡的LV總和不得超過12")
            } else {
                console.log("[GameObject] width: " + gameObject.width)
                console.log("[GameObject] height: " + gameObject.height)

                // gameObject.setPipeline("wipeShader")

                // // Control the shader's progress uniform
                // let progress = 0
                // const event = scene.time.addEvent({
                //     delay: 50,
                //     callback: () => {
                //         progress += 0.01
                //         gameObject.pipeline.set1f("progress", progress) // Set uniform for shader

                //         if (progress >= 1) {
                //             event.remove() // Stop updating shader
                //         }
                //     },
                //     loop: true,
                // })

                switch (dropZone.name) {
                    case "authorZone1":
                        this.authorDeck[0] = gameObject.getData("id")
                        break
                    case "authorZone2":
                        this.authorDeck[1] = gameObject.getData("id")
                        break
                    case "authorZone3":
                        this.authorDeck[2] = gameObject.getData("id")
                        break
                    case "authorZone4":
                        this.authorDeck[3] = gameObject.getData("id")
                        break
                    case "authorZone5":
                        this.authorDeck[4] = gameObject.getData("id")
                        break
                    default:
                        break
                }
                // if (isOverDropZone(gameObject, dropZone)) {
                //     console.log("Card dropped inside the drop zone!")
                // } else {
                //     console.log("Card dropped outside the drop zone.")
                // }
                if (dropZone.data.list.cards === 0) {
                    // 鎖定卡牌位置
                    gameObject.x = dropZone.x
                    gameObject.y = dropZone.y
                    dropZone.data.list.cards++
                    this.currentRarity += gameObject.getData("rarity")
                    scene.authorCardEditInfoText3.text = `LV: ${this.currentRarity} / ${this.maxRarity}`
                    scene.input.setDraggable(gameObject, false)
                }
                console.log(this.authorDeck)
                if (this.areAllAuthorCardsPlaced()) {
                    scene.buildSaveText.setInteractive()
                    scene.buildSaveText.setColor("#00ffff")
                }
            }
        })

        scene.input.on("dragend", (pointer, gameObject, dropped) => {
            gameObject.setTint()
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
        })

        // function isOverDropZone(card, dropZone) {
        //     const cardBounds = card.getBounds()
        //     const dropZoneBounds = dropZone.getBounds()

        //     return Phaser.Geom.Rectangle.Contains(dropZoneBounds, cardBounds.centerX, cardBounds.centerY)
        // }
    }

    areAllAuthorCardsPlaced() {
        return this.authorDeck.every((element) => element !== "")
    }
}
