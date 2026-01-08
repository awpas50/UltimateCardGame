import CardPointConverter from "../helpers/CardPointConverter"
import AbilityReader from "../helpers/AbilityReader"

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
                padding: { x: 10, y: 6 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setData({ id: id })

        const { width, height } = text
        const bgWidth = width + 25
        const bgHeight = height + 10

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

    // calculation: '+', '-'
    modify(calculation) {
        const numToModify = 10 // + or - 10 points every time
        if (calculation !== "+" && calculation !== "-") {
            console.error(
                "%c[PointControlPopup Error] Invalid calculation parameter.",
                "color: red; font-size: 18px; font-weight: bold;"
            )
            return
        }

        const gameObject = this.cardRef
        const scene = this.scene
        const cardObjectData = gameObject.data.list

        // e.g. $element=木,水$type=fixed$min=0$max=90
        const target = scene.GameHandler.target
        const type = AbilityReader.getValueByTag(target, "$type") // type: fixed / relative
        const min = Number(AbilityReader.getValueByTag(target, "$min"))
        const max = Number(AbilityReader.getValueByTag(target, "$max"))

        const currentCardPoints = CardPointConverter.getPoints(gameObject)
        console.log(`[PointControlPopup] Original points: ${currentCardPoints}`)
        console.log(`max: ${max}, min: ${min}`)

        if (type === "fixed") {
            // 例子: W006 - 童年袁枚: 數值調整設置為0到90之間。假設 min = 0, max = 90，則設置範圍為 0 到 90。
            if (currentCardPoints + numToModify > max && calculation === "+") {
                console.log("[PointControlPopup - fixed] Reached + limit, cannot modify further.")
                return
            }
            if (currentCardPoints - numToModify < min && calculation === "-") {
                console.log("[PointControlPopup - fixed] Reached - limit, cannot modify further.")
                return
            }
            // must run before cardObjectData.isForcedSetPoints true
            cardObjectData.isForcedSetPoints = true
            cardObjectData.modifiedPoints =
                CardPointConverter.getPoints(gameObject) + parseInt(numToModify) * (calculation === "+" ? 1 : -1)
        } else if (type === "relative") {
            // 例子: W018 - 莊子: 數值調整加或減50點以內（以靈感卡數值為中心）。假設originalPoints = 30, min = -50, max = 50，則設置範圍為 0 (最小為0) 到 80。
            if (
                currentCardPoints + numToModify > Number(CardPointConverter.getCardBasePoints(gameObject) + max) &&
                calculation === "+"
            ) {
                console.log("[PointControlPopup - relative] Reached + limit, cannot modify further.")
                return
            }
            if (
                calculation === "-" &&
                (currentCardPoints - numToModify < Number(CardPointConverter.getCardBasePoints(gameObject) + min) ||
                    currentCardPoints - numToModify < 0)
            ) {
                console.log("[PointControlPopup - relative] Reached - limit, cannot modify further.")
                return
            }
            cardObjectData.isForcedSetPoints = false
            cardObjectData.extraPoints += parseInt(numToModify) * (calculation === "+" ? 1 : -1)
        }
        scene.Toast.showToast(`${currentCardPoints} -> ${CardPointConverter.getPoints(gameObject)}`)

        if (CardPointConverter.getPoints(gameObject) < 0) {
            gameObject.getAt(2)?.setTexture(`extra_number_0`)
        } else if (CardPointConverter.getPoints(gameObject) >= 90) {
            gameObject.getAt(2)?.setTexture(`extra_number_90`)
        } else {
            gameObject.getAt(2)?.setTexture(`extra_number_${CardPointConverter.getPoints(gameObject)}`)
        }
        gameObject.getAt(2)?.setVisible(true)

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
            CardPointConverter.getPoints(gameObject),
            scene.GameHandler.currentRoomID
        )
    }
}
