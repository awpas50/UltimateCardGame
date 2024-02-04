import Card from "./card";

export default class ICard extends Card {
    constructor(scene) {
        super(scene);
        this.name = "ICard";
        this.playerCardSprite = "I002";
        this.opponentCardSprite = "I002";
    }
}