import CardHandler from "../helpers/CardHandler";
import DeckHandler from "../helpers/DeckHandler";
import GameHandler from "../helpers/GameHandler";
import InteractiveHandler from "../helpers/InteractiveHandler";
import SocketHandler from "../helpers/SocketHandler";
import UIHandler from "../helpers/UIHandler";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        })
    }

    // before creation
    preload() {
        this.load.image('I001', require('../assets/ICard/I001.png').default);
        this.load.image('I002', require('../assets/ICard/I002.png').default);
        this.load.image('I003', require('../assets/ICard/I003.png').default);
        this.load.image('I004', require('../assets/ICard/I004.png').default);
        this.load.image('I005', require('../assets/ICard/I005.png').default);
        this.load.image('I006', require('../assets/ICard/I006.png').default);
        this.load.image('I007', require('../assets/ICard/I007.png').default);
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
    }

    update() {

    }
}