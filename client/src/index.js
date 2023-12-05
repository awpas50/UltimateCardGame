import Phaser from 'phaser';
import Game from './scenes/game.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 600,
        height: 800,
    },
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);
