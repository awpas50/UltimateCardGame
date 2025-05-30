import ScoreBoardHandler from "../scoreboard_scene/ScoreBoardHandler"
import Toast from "../components/Toast"
export default class ScoreBoard extends Phaser.Scene {
    constructor() {
        super({
            key: "ScoreBoard",
        })
    }

    preload() {
        this.load.audio("BGM1", require("../sfx/BGM1.mp3").default)
        this.load.audio("flipCard1", require("../sfx/flipCard1.mp3").default)
        this.load.audio("flipCard2", require("../sfx/flipCard2.wav").default)
        this.load.audio("flipCard3", require("../sfx/flipCard3.wav").default)
        this.load.audio("dragCard", require("../sfx/dragCard.wav").default)
    }
    create() {
        this.setupSounds()

        this.cameras.main.roundPixels = true
        // Set scale mode
        this.scale.scaleMode = Phaser.Scale.ScaleModes.NEAREST
        // Ensure the canvas doesn't smooth images
        this.scale.canvas.setAttribute("image-rendering", "pixelated")
        this.ScoreBoardHandler = new ScoreBoardHandler(this)
        this.Toast = new Toast(this)

        this.ScoreBoardHandler.initUI()
    }

    setupSounds = () => {
        this.sound.add("flipCard1")
        this.sound.add("flipCard2")
        this.sound.add("flipCard3")
        this.sound.add("dragCard")
    }
}
