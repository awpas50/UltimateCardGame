import Card from "./card";

export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.name = "cardBack";
        this.playerCardSprite = "I001";
        this.opponentCardSprite = "I002";
    }
}