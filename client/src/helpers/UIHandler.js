import ZoneHandler from "./ZoneHandler";

export default class UIHandler {
    constructor(scene) {
        this.zoneHandler = new ZoneHandler(scene);

        this.buildZones = () => {
            scene.dropZone = this.zoneHandler.renderZone(200, 400);
            this.zoneHandler.renderOutline(scene.dropZone);
        }

        this.buildPlayerAreas = () => {
            scene.playerHandArea = scene.add.rectangle(200, 660, 350, 230);
            scene.playerHandArea.setStrokeStyle(4, 0xff69b4);
            scene.playerDeckArea = scene.add.rectangle(470, 660, 155, 215);
            scene.playerDeckArea.setStrokeStyle(4, 0x00ffff);

            scene.opponentHandArea = scene.add.rectangle(200, 135, 350, 230);
            scene.opponentHandArea.setStrokeStyle(4, 0xff69b4);
            scene.opponentDeckArea = scene.add.rectangle(470, 135, 155, 215);
            scene.opponentDeckArea.setStrokeStyle(4, 0x00ffff);
        }

        this.buildPlayerNumberText = (playerNumber) => {
            scene.playerNumberText = scene.add.text(700, 100, "你是: 玩家 " + playerNumber).setFontSize(32).setFontFamily("Trebuchet MS"); 
        }

        this.buildGameText = () => {
            scene.dealCards = scene.add.text(400, 400, "抽卡").setFontSize(32).setFontFamily("Trebuchet MS");
        }

        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerAreas();
            this.buildGameText();
        }
    }
}