import Card from "./card";

export default class Boolean extends Card {
    constructor(scene) {
        super(scene);
        this.name = "boolean";
        this.playerCardSprite = "I004";
        this.opponentCardSprite = "I004";
    }
}