import Card from "./card";

export default class Ping extends Card {
    constructor(scene) {
        super(scene);
        this.name = "ping";
        this.playerCardSprite = "I001";
        this.opponentCardSprite = "I001";
    }
}