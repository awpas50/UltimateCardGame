import Card from "./card";

export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.name = "cardBack";
        this.playerCardSprite = "H001B";
        this.opponentCardSprite = "W001B";
    }
}