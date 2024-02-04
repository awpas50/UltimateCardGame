export default class Card {
    constructor(scene) {
        this.render = (x, y, type) => {
            let sprite;
            if(type === 'playerCard') {
                sprite = this.playerCardSprite;
            }
            else {
                sprite = this.opponentCardSprite;
            }

            if(type === 'playerCard') {
                scene.input.setDraggable(card);
            }
            // add.image: Phaser 3 built-in code (x-coordinate, y-coordinate, image referenced by name in game.js)
            let card = scene.add.image(x, y, sprite).setInteractive().setData({
                "name": this.name,
                "type": type,
                "sprite": sprite
            });
            
            return card;
        }
    }
}