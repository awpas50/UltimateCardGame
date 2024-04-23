import ZoneHandler from "./ZoneHandler";

export default class UIHandler {
    constructor(scene) {
        this.zoneHandler = new ZoneHandler(scene);
        this.inputText = {};
        //-----------------------------------------------------
        this.BuildZones = () => {
            scene.dropZone1 = this.zoneHandler.renderZone(189, 458, 330 / 3.25, 430 / 3.25);
            scene.dropZone2 = this.zoneHandler.renderZone(90, 575, 330 / 3.25, 430 / 3.25);
            scene.dropZone3 = this.zoneHandler.renderZone(280, 575, 330 / 3.25, 430 / 3.25);
            scene.dropZone4 = this.zoneHandler.renderZone(189, 690, 330 / 3.25, 430 / 3.25);

            scene.dropZone1.setName("dropZone1");
            scene.dropZone2.setName("dropZone2");
            scene.dropZone3.setName("dropZone3");
            scene.dropZone4.setName("dropZone4");
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
            scene.playerDeckArea = scene.add.rectangle(375, 695, 78, 115);
            scene.playerDeckArea.setStrokeStyle(4, 0x00ffff);
            scene.playerRubbishBinArea = scene.add.rectangle(470, 695, 78, 115);
            scene.playerRubbishBinArea.setStrokeStyle(4, 0x00ffff);

            scene.opponentHandArea = scene.add.rectangle(200, -85, 350, 230);
            scene.opponentHandArea.setStrokeStyle(4, 0xff69b4);
            scene.opponentDeckArea = scene.add.rectangle(375, 112, 78, 115);
            scene.opponentDeckArea.setStrokeStyle(4, 0x00ffff);
            scene.opponentRubbishBinArea = scene.add.rectangle(470, 112, 78, 115);
            scene.opponentRubbishBinArea.setStrokeStyle(4, 0x00ffff);
        }

        this.buildPlayerNumberText = (playerNumber) => {
            scene.playerNumberText = scene.add.text(350, 250, "你是: 玩家 ").setFontSize(20).setFontFamily("Trebuchet MS");
            if(playerNumber == 1) {
                scene.playerNumberText.text = "你是: 玩家1";
            } else {
                scene.playerNumberText.text = "你是: 玩家2";
            }
        }

        this.buildPlayerTurnText = () => { 
            scene.playerTurnText = scene.add.text(350, 300, "等待另一位玩家抽卡...").setFontSize(20).setFontFamily("Trebuchet MS");
        }

        this.setPlayerTurnText = (b) => {
            if(b === true) {
                scene.playerTurnText.text = '你的回合';
            } else { 
                scene.playerTurnText.text = '對方的回合';
            }
        }

        this.buildPlayerPointText = () => { // Leave it empty
            scene.playerPointText = scene.add.text(350, 350, " ").setFontSize(20).setFontFamily("Trebuchet MS");
        }

        this.setPlayerPointText = (points) => {
            scene.playerPointText.text = '靈感值:' + points;
        }

        this.BuildGameText = () => {
            // Let a variable called dealCardText, and this is a text. In Unity: Text dealCardText = new Text().....;
            scene.dealCardText = scene.add.text(350, 400, "點我抽卡").setFontSize(20).setFontFamily("Trebuchet MS");

            // OnPointerDown event
            scene.dealCardText.on('pointerdown', () => {
                scene.socket.emit("dealCards", scene.socket.id);
                scene.dealCardText.disableInteractive();
            })
            // Control card color
            scene.dealCardText.on('pointerover', () => {
                scene.dealCardText.setColor('#fff5fa');
            })
            scene.dealCardText.on('pointerout', () => {
                scene.dealCardText.setColor('#00ffff');
            })
        }

        this.ActivateGameText = () => {
            if(scene.dealCardText != undefined || scene.dealCardText != null) {
                scene.dealCardText.setInteractive();
                scene.dealCardText.setColor('#00ffff');
            }
        }

        this.BuildRollDiceText = () => {
            scene.rollDiceText1 = scene.add.text(350, 560, " ").setFontSize(20).setFontFamily("Trebuchet MS");
            scene.rollDiceText2 = scene.add.text(350, 590, " ").setFontSize(20).setFontFamily("Trebuchet MS");
        }
        this.setRollDiceText = (num1, num2) => {
            scene.rollDiceText1.text = '玩家1擲出:' + num1;
            scene.rollDiceText2.text = '玩家2擲出:' + num2;
        }

        this.BuildRoomNumberText = () => {
            scene.roomNumberText = scene.add.text(440, 20, "房間編號: ").setFontSize(20).setFontFamily("Trebuchet MS");
        }

        this.BuildCreateRoomText = () => { 
            scene.createRoomText = scene.add.text(350, 500, "建立房間", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" });
            scene.createRoomText.setInteractive();

            scene.createRoomText.on('pointerdown', () => {
                this.BuildPlayArea();
                let randomRoomId = this.generateRoomID();
                scene.socket.emit('createRoom', randomRoomId);
                console.log(scene.UIHandler.inputText.text);
                scene.createRoomText.disableInteractive();
                scene.joinRoomText.disableInteractive();
                scene.roomNumberText.text = "房間編號: " + randomRoomId;
            })
            // Card color
            scene.createRoomText.on('pointerover', () => {
                scene.createRoomText.setColor('#fff5fa');
            })
            scene.createRoomText.on('pointerout', () => {
                scene.createRoomText.setColor('#00ffff');
            }) 
        }

        scene.socket.on('joinRoomSucceedSignal', () => {
            this.BuildPlayArea();
            scene.createRoomText.disableInteractive();
            scene.joinRoomText.disableInteractive();
            scene.roomNumberText.text = "房間編號: " + scene.UIHandler.GetInputTextContent(scene.UIHandler.inputText);

            scene.socket.emit('dealDeck', scene.socket.id);
        });
        
        this.BuildJoinRoomText = () => { 
            scene.joinRoomText = scene.add.text(350, 550, "加入房間", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" });
            scene.joinRoomText.setInteractive();
            scene.joinRoomText.on('pointerdown', () => {
                scene.socket.emit('joinRoom', scene.UIHandler.GetInputTextContent(scene.UIHandler.inputText));

                // (Runs joinRoomSucceedSignal if success.)
            })
            // Card color
            scene.joinRoomText.on('pointerover', () => {
                scene.joinRoomText.setColor('#fff5fa');
            })
            scene.joinRoomText.on('pointerout', () => {
                scene.joinRoomText.setColor('#00ffff');
            })
            
        }

        // Main
        this.BuildPlayArea = () => {
            console.log("BuildPlayArea");
            this.BuildZones();
            this.BuildZoneOutline();
            this.BuildPlayerAreas();
            this.BuildGameText(); 
            this.BuildRollDiceText();
        }

        this.BuildLobby = () => {
            this.BuildRoomNumberText();
            this.BuildCreateRoomText();
            this.BuildJoinRoomText();
        }
        // Main
        this.BuildRoomNumberFieldDecoration = (inputText) => { 
            scene.rexUI.add.roundRectangle(400, 600, 100, 30, 0, 0x666666);
            inputText = scene.add.text(430, 610, '', { fixedWidth: 150, fixedHeight: 36 });
            inputText.setOrigin(0.5, 0.5);
            inputText.setInteractive().on('pointerdown', () => {
                const editor = scene.rexUI.edit(inputText);
                const elem = editor.inputText.node;
                elem.style.top = '-10px';
            })
            return inputText;
        }
        this.GetInputTextContent = (inputText) => {
            return inputText.text;
        }

        // const textMessage = getTextContent(inputText);
        // console.log(textMessage); // Output: "123456"

        // this.getTextContent = (textObject) => {
        //     return textObject.text;
        // }

        this.generateRoomID = () => {
            // Generate a random number between 0 and 999999 (inclusive)
            const randomNumber = Math.floor(Math.random() * 1000000);
          
            // Convert the number to a string and pad it with leading zeros if needed
            const randomNumberString = randomNumber.toString().padStart(6, '0');
          
            return randomNumberString;
          }
    }
}