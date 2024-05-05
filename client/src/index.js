import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import Game from './scenes/game.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        //width: clientWidth,
        //height: clientHeight,
        width: 600,
        height: 825,
    },
    parent: 'phaser-container',
	dom: {
        createContainer: true
    },
    plugins: {
		scene: [
			{
				key: 'rexUI',
				plugin: RexUIPlugin,
				mapping: 'rexUI'
			}
		]
    },
    render: {
        //antialias: false,  // Disable anti-aliasing
        //pixelArt: true,     // Enable pixel art mode
        //antialiasGL: false,     // Disable WebGL anti-aliasing
        //roundPixels: true       // Round pixels for crisp rendering
    },
    scene: [
        Game
    ],
    resolution: window.devicePixelRatio
    
};

const game = new Phaser.Game(config);
