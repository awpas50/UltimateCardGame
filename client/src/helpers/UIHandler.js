import ZoneHandler from "./ZoneHandler";

export default class UIHandler {
    constructor(scene) {
        this.zoneHandler = new ZoneHandler(scene);
        
        this.BuildZones = () => {
            scene.dropZone1 = this.zoneHandler.renderZone(189, 458, 330 / 3.25, 430 / 3.25);
            scene.dropZone2 = this.zoneHandler.renderZone(90, 575, 330 / 3.25, 430 / 3.25);
            scene.dropZone3 = this.zoneHandler.renderZone(280, 575, 330 / 3.25, 430 / 3.25);

            scene.dropZone1.setName("dropZone1");
            scene.dropZone2.setName("dropZone2");
            scene.dropZone3.setName("dropZone3");
        }

        this.getDropZone1 = () => {
            return this.scene.dropZone1.name;
        }
        this.getDropZone2 = () => {
            return this.scene.dropZone2.name;
        }
        this.getDropZone3 = () => {
            return this.scene.dropZone3.name;
        }

        this.BuildZoneOutline = () => {
            this.zoneHandler.renderOutlineGrid(220, 270, 330, 430);
        }

        this.BuildPlayerAreas = () => {
            scene.playerHandArea = scene.add.rectangle(200, 880, 350, 230);
            scene.playerHandArea.setStrokeStyle(4, 0xff69b4);
            scene.playerDeckArea = scene.add.rectangle(470, 660, 155, 215);
            scene.playerDeckArea.setStrokeStyle(4, 0x00ffff);

            scene.opponentHandArea = scene.add.rectangle(200, -85, 350, 230);
            scene.opponentHandArea.setStrokeStyle(4, 0xff69b4);
            scene.opponentDeckArea = scene.add.rectangle(470, 135, 155, 215);
            scene.opponentDeckArea.setStrokeStyle(4, 0x00ffff);
        }

        this.buildPlayerNumberText = (playerNumber) => {
            scene.playerNumberText = scene.add.text(700, 100, "你是: 玩家 ").setFontSize(32).setFontFamily("Trebuchet MS");
            if(playerNumber == 1) {
                scene.playerNumberText.text = "你是: 玩家1";
            } else {
                scene.playerNumberText.text = "你是: 玩家2";
            }
        }

        this.buildPlayerTurnText = () => {
            scene.playerTurnText = scene.add.text(700, 160, "正在等待另一位玩家抽卡......").setFontSize(32).setFontFamily("Trebuchet MS");
        }

        this.setPlayerTurnText = (b) => {
            if(b === true) {
                scene.playerTurnText.text = '你的回合';
            } else { 
                scene.playerTurnText.text = '對方的回合';
            }
        }

        this.BuildGameText = () => {
            // Let a variable called dealCards, and this is a text.
            scene.dealCardText = scene.add.text(430, 400, "點我抽卡").setFontSize(32).setFontFamily("Trebuchet MS");
        }

        this.buildUI = () => {
            this.BuildZones();
            this.BuildZoneOutline();
            this.BuildPlayerAreas();
            this.BuildGameText(); 
        }
    }
}