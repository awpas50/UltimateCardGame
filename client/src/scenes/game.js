import UIHandler from "../helpers/UIHandler";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        })
    }

    // before creation
    preload() {

    }

    // just like void Start() in Unity
    create() {
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();
    }

    update() {

    }
}