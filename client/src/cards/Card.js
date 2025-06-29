import { ICard_Data_24256, WCard_Data_24256 } from "../scenes/game.js"

export default class Card {
    constructor(scene) {
        this.render = (x, y, cardType, side) => {
            let sprite
            const container = scene.add.container(x, y)
            let card
            let newElementImage
            let newIPointImage

            if (side === "playerCard") {
                sprite = this.playerCardSprite
            } else {
                sprite = this.opponentCardSprite
            }

            // add.image: Phaser 3 built-in code (x-coordinate, y-coordinate, image referenced by name in game.js)
            if (cardType == "HCard") {
                container.setData({
                    id: this.id,
                    element: "無",
                    points: -1,

                    side: side,
                    sprite: sprite,
                    activeState: "inDeck", // inDeck (一般不用), inHand, inScene, inRubbishBin (一般不用)
                    cardPosition: -1, // 0: 天, 1: 地, 2: 人, 3: 日
                    flipped: false,
                })
                card = scene.add.image(0, 0, sprite)
                container.add([card])
            }
            if (cardType == "ICard") {
                newElementImage = scene.add.image(0, 0, "extra_element_0")
                newElementImage.visible = false // hide by default
                container.setData({
                    id: this.id,
                    element: ICard_Data_24256[this.id].element,
                    series: ICard_Data_24256[this.id].series,
                    points: ICard_Data_24256[this.id].points, // 對戰中任何情況都不應修改
                    rarity: ICard_Data_24256[this.id].rarity,
                    tag: ICard_Data_24256[this.id].tag,

                    side: side,
                    sprite: sprite,

                    isForcedSetPoints: false, // 是否被強制設定靈感值, true: 靈感值 = modifiedPoints, false: 靈感值 = points + extraPoints
                    modifiedPoints: 0,
                    extraPoints: 0, // 額外加成靈感值 (不包括作者屬性加成)

                    modifiedElement: "", // 是否被轉屬?
                    activeState: "inDeck", // inDeck (一般不用), inHand, inScene, inRubbishBin (一般不用)
                    cardPosition: -1, // 0: 天, 1: 地, 2: 人, 3: 日
                    flipped: false,
                })
                card = scene.add.image(0, 0, sprite)
                container.add([card, newElementImage])
            }
            if (cardType == "WCard") {
                container.setData({
                    id: WCard_Data_24256[this.id].ID,
                    side: side, // playerCard || opponentCard
                    sprite: sprite,
                    startX: x,
                    startY: y,

                    name: WCard_Data_24256[this.id].name,
                    rarity: WCard_Data_24256[this.id].rarity,
                    sky: WCard_Data_24256[this.id].sky,
                    ground: WCard_Data_24256[this.id].ground,
                    person: WCard_Data_24256[this.id].person,
                    authorBuffs: WCard_Data_24256[this.id].authorBuffs,
                    ability: WCard_Data_24256[this.id].ability || "",
                    target: WCard_Data_24256[this.id].target || "",
                    targetRules: WCard_Data_24256[this.id].targetRules || "",
                    hasActiveSkill: WCard_Data_24256[this.id].hasActiveSkill || false,
                    abilityCharges: WCard_Data_24256[this.id].abilityCharges || 0,
                })
                card = scene.add.image(0, 0, sprite)
                container.add([card])
            }
            if (cardType == "cardBack") {
                container.setData({
                    id: this.id,
                    side: side,
                    sprite: sprite,
                })
                card = scene.add.image(0, 0, sprite)
                container.add([card])
            }
            container.setSize(card.displayWidth, card.displayHeight)
            container.setInteractive()
            if (side === "playerCard") {
                scene.input.setDraggable(container)
            }
            return container
        }
    }
}
