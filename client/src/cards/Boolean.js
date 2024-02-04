import Card from "./Card.js";

export default class Boolean extends Card {
    constructor(scene) {
        super(scene);
        this.name = "boolean";
        this.playerCardSprite = "I017";
        this.opponentCardSprite = "I017";
    }
}