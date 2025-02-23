import Card from "./Card.js"

export default class CardBack extends Card {
    constructor(scene) {
        super(scene)
        this.id = "cardBack"
        this.playerCardSprite = "image_cardback"
        this.opponentCardSprite = "image_cardback"
    }
}
