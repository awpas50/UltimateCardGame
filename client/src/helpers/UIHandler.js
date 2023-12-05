export default class UIHandler {
    constructor(scene) {
        this.buildGameText = () => {
            scene.dealCards = scene.add.text(400, 400, "Deal Cards").setFontSize(14).setFontFamily("Trebuchet MS");
        }

        this.buildUI = () => {
            this.buildGameText();
        }
    }
}