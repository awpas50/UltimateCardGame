import CardHandler from "../helpers/CardHandler";
import DeckHandler from "../helpers/DeckHandler";
import GameHandler from "../helpers/GameHandler";
import InteractiveHandler from "../helpers/InteractiveHandler";
import SocketHandler from "../helpers/SocketHandler";
import UIHandler from "../helpers/UIHandler";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game',
            pixelart: true
        })
    }

    // before creation
    preload() {
        this.load.image('W009', require('../assets/ACard/W009.jpg').default);
        this.load.image('W010', require('../assets/ACard/W010.jpg').default);

        this.load.image('I002', require('../assets/ICard/I002.jpg').default);
        this.load.image('I005', require('../assets/ICard/I005.jpg').default);
        this.load.image('I006', require('../assets/ICard/I006.jpg').default);
        this.load.image('I017', require('../assets/ICard/I017.jpg').default);
        this.load.image('I022', require('../assets/ICard/I022.jpg').default);
        this.load.image('I023', require('../assets/ICard/I023.jpg').default);

        this.load.image('I025', require('../assets/ICard/I025.jpg').default);
        this.load.image('I026', require('../assets/ICard/I026.jpg').default);
        this.load.image('I027', require('../assets/ICard/I027.jpg').default);
        this.load.image('I028', require('../assets/ICard/I028.jpg').default);
        this.load.image('I030', require('../assets/ICard/I030.jpg').default);
        this.load.image('I035', require('../assets/ICard/I035.jpg').default);

        this.load.image('H001B', require('../assets/Back/H001B.png').default);
        this.load.image('H001B_Filped', require('../assets/Back/H001B_Filped.png').default);
        this.load.image('W001B', require('../assets/Back/W001B.png').default);
        this.load.image('Test1', require('../assets/Back/Test1.jpg').default);

        this.load.image('BG', require('../assets/Back/WoodBackground.jpg').default); 
    }

    // just like void Start() in Unity
    create() {
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();

        this.InteractiveHandler = new InteractiveHandler(this);
        // let backgroundImage = this.add.image(0, 0, 'BG');
        // backgroundImage.setOrigin(0, 0);
        // backgroundImage.setDepth(0); // Set a depth level for the background
        // backgroundImage.disableInteractive();
    }

    update() {

    }
}