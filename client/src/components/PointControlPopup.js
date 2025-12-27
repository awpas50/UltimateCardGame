import CardPointConverter from "../helpers/CardPointConverter"

export default class PointControlPopup {
    constructor(scene) {
        this.scene = scene
        this.cardRef = null
        this.leftPopupRef = null
        this.rightPopupRef = null
        this.bottomPopupRef = null
    }

    createText({ x, y, message, id }) {
        const graphics = this.scene.add.graphics()

        const text = this.scene.add
            .text(x, y, message, {
                fontSize: "26px",
                fontFamily: "Trebuchet MS",
                color: "#ffffff",
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setData({ id: id })

        const { width, height } = text
        const bgWidth = width + 35
        const bgHeight = height + 20

        graphics
            .fillStyle(0x302e2e, 1) // grey background
            .fillRoundedRect(x - bgWidth / 2, y - bgHeight / 2, bgWidth, bgHeight, 8)

        // Group everything, assign unique id
        const container = this.scene.add.container(0, 0, [graphics, text]).setDepth(100).setAlpha(1)

        return container
    }

    open = (cardRef, positionX, positionY) => {
        if (this.leftPopupRef || this.rightPopupRef) {
            console.error(
                "%c[PointControlPopup Error] It shouldn't happen....",
                "color: red; font-size: 18px; font-weight: bold;"
            )
            return
        }
        this.cardRef = cardRef
        this.leftPopupRef = this.createText({
            x: positionX - 40,
            y: positionY - 90,
            message: "-",
            id: "leftPointControl", // unique id
        })
        this.rightPopupRef = this.createText({
            x: positionX + 40,
            y: positionY - 90,
            message: "+",
            id: "rightPointControl", // unique id
        })
        this.bottomPopupRef = this.createText({
            x: positionX,
            y: positionY + 90,
            message: "OK",
            id: "bottomPointControl", // unique id
        })
    }

    close() {
        if (this.cardRef) {
            // do not destroy it
            this.cardRef = null
        }
        if (this.leftPopupRef) {
            this.leftPopupRef.destroy()
            this.leftPopupRef = null
        }
        if (this.rightPopupRef) {
            this.rightPopupRef.destroy()
            this.rightPopupRef = null
        }
        if (this.bottomPopupRef) {
            this.bottomPopupRef.destroy()
            this.bottomPopupRef = null
        }
    }

    add() {
        const gameObject = this.cardRef
        const scene = this.scene
        // temp debug: set modifiedPoints to 30
        gameObject.getAt(2)?.setTexture(`extra_number_30`)
        gameObject.getAt(2)?.setVisible(true)
        const originalPoints = CardPointConverter.getPoints(gameObject)
        if (type === "fixed") {
            cardObjectData.isForcedSetPoints = true
            cardObjectData.modifiedPoints = parseInt(debug)
        } else if (type === "relative") {
            cardObjectData.isForcedSetPoints = false
            cardObjectData.extraPoints = parseInt(debug)
        }
        scene.Toast.showToast(`${originalPoints} -> ${debug}`)

        const authorBuffPts = CardPointConverter.setAuthorBuffPointForICard(gameObject, scene.GameHandler.authorBuffs)
        scene.socket.emit(
            "serverSetCardType",
            cardObjectData.side === "playerCard" ? scene.socket.id : scene.GameHandler.opponentID,
            cardObjectData.cardPosition, // 天(0), 地(1), 人(2)
            cardObjectData.element,
            CardPointConverter.getPoints(gameObject),
            cardObjectData.series,
            cardObjectData.rarity,
            authorBuffPts
        )
        // 通知server再call SocketHandler的calculatePoints。
        scene.socket.emit(
            "serverUpdatePoints",
            scene.socket.id,
            CardPointConverter.getPoints(gameObject) + authorBuffPts,
            "dropZone" + String(cardObjectData.cardPosition + 1), // dropZone1, dropZone2, dropZone3
            scene.GameHandler.currentRoomID
        )
        // 通知server再call SocketHandler的localUpdateOpponentCard。對方能見到你更新了卡牌
        // 用法:傳入cardPosition和side,如果side = playerCard則opponentCard狀態更新。反之亦然。
        scene.socket.emit(
            "serverNotifyCardUpdated",
            scene.socket.id,
            cardObjectData.cardPosition,
            cardObjectData.side,
            true,
            null,
            debug,
            scene.GameHandler.currentRoomID
        )
    }
}
