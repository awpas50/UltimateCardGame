import Card from "./card";

export default class Ping extends Card {
    constructor(scene) {
        super(scene);
        this.name = "ping";
        this.playerCardSprite = "I002";
        this.opponentCardSprite = "I002";
    }
}