import Card from "./Card.js";

export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.id = "cardBack";
        this.playerCardSprite = "H001B"; 
        this.opponentCardSprite = "H001B_Filped";
    }
}