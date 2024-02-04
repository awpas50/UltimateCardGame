export default class Card {
    constructor(scene) {
        this.render = (x, y, side) => {
            let sprite;
            let card;
            if(side === 'playerCard') {
                sprite = this.playerCardSprite;
            }
            else {
                sprite = this.opponentCardSprite;
            }
            
            // add.image: Phaser 3 built-in code (x-coordinate, y-coordinate, image referenced by name in game.js)
            card = scene.add.image(x, y, sprite).setInteractive().setData({
                "id": this.id,
                "side": side,
                "sprite": sprite
            }); 
            
            if(side === 'playerCard') { 
                scene.input.setDraggable(card);
            }
             
            return card;
        }
    }
}