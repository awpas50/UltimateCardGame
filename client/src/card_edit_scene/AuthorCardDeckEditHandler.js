import Color from "../helpers/Color"
import PositionHandler from "../helpers/PositionHandler"

export default class AuthorCardDeckEditHandler {
    constructor(scene) {
        this.authorDeck = ["", "", "", "", ""]
        this.initUI = () => {
            this.renderZone(90, 330, 330 / 3.25, 430 / 3.25, "authorZone1")
            this.renderZone(195, 330, 330 / 3.25, 430 / 3.25, "authorZone2")
            this.renderZone(300, 330, 330 / 3.25, 430 / 3.25, "authorZone3")
            this.renderZone(405, 330, 330 / 3.25, 430 / 3.25, "authorZone4")
            this.renderZone(510, 330, 330 / 3.25, 430 / 3.25, "authorZone5")
            this.renderOutlineGrid(40, 260, PositionHandler.outlineGrid.width, PositionHandler.outlineGrid.height)
            this.buildBackText()
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

        this.buildBackText = () => {
            scene.buildBackText = scene.add.text(PositionHandler.backText.x, PositionHandler.backText.y, "返回", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
            scene.buildBackText.setInteractive()
            scene.buildBackText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.scene.wake("Game")
                scene.scene.get("Game").sys.setVisible(true)
                scene.scene.get("Game").sys.setActive(true)
                scene.scene.stop("AuthorCardEdit")
                if (this.authorDeck.some((element) => element === "")) {
                    localStorage.removeItem("authorDeck")
                } else {
                    localStorage.setItem("authorDeck", JSON.stringify(this.authorDeck))
                }
            })
            // Card color
            scene.buildBackText.on("pointerover", () => {
                scene.buildBackText.setColor("#fff5fa")
            })
            scene.buildBackText.on("pointerout", () => {
                scene.buildBackText.setColor("#00ffff")
            })
        }

        this.generateWCards = () => {
            const maxCardsInRow = 5
            const totalCards = 17
            let wCardId
            let counter = 0

            for (let i = 0; i < totalCards; i++) {
                counter++
                wCardId = counter >= 0 && counter <= 9 ? "0" + counter : counter
                const x = 80 + (i % maxCardsInRow) * 100
                const y = 500 + Math.floor(i / maxCardsInRow) * 100

                console.log("counter: " + counter)
                console.log("wCardId: " + wCardId)

                const card = scene.add
                    .image(x, y, "23246_W0" + wCardId)
                    .setInteractive()
                    .setScale(0.26, 0.26)
                    .setData({
                        id: "23246_W0" + wCardId,
                    })

                scene.input.setDraggable(card)

                // Optional: If you want to handle drag events
                card.on("drag", (pointer, dragX, dragY) => {
                    card.x = dragX
                    card.y = dragY
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
            } else {
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

                    scene.input.setDraggable(gameObject, false)
                }
                console.log(this.authorDeck)
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
}
