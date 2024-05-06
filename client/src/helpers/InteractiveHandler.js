import {ICard_Data_23246, WCard_Data_23246} from "../scenes/game.js";

export default class InteractiveHandler {
    constructor(scene) {
        // Section: Card preview
        // Create cardPreview on pointerdown
        
        let isCardPreviewActive = false;
        //scene.cardPreview = scene.add.image(0, 0, "I001");
        //scene.cardPreview.setVisible(false);
        this.cardPreview = null;

        scene.input.on('pointerdown', (event, gameObjects) => {
            let pointer = scene.input.activePointer;
            // Check if gameObject is defined
            console.log("isCardPreviewActive: " + isCardPreviewActive);
            // If not clicking anything gameObjects returns empty array, like this....... []
            console.log(gameObjects);
            if((gameObjects.length == 0 || gameObjects[0].type === "Zone") && isCardPreviewActive && this.cardPreview !== null) {
                console.log("AAAAAAA");
                this.cardPreview.setPosition(1250, 400);
                this.isCardPreviewActive = false;
            }
            if (!gameObjects || gameObjects.length == 0) {
                return;
            }
            if (gameObjects[0].type === "Image" &&
                gameObjects[0].data.list.id !== "cardBack") {
                //scene.sound.play('dragCard');
                //scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY - 200, gameObjects[0].data.values.sprite).setScale(1, 1);
                console.log(gameObjects[0].data);
                if(this.cardPreview === null) {
                    this.cardPreview = scene.add.image(750, 400, gameObjects[0].data.values.sprite).setScale(0.7, 0.7);
                } else {
                    this.cardPreview.setTexture(gameObjects[0].data.values.sprite).setScale(0.7, 0.7);
                    this.cardPreview.setPosition(750, 400); 
                }
                let tween = scene.tweens.add({
                    targets: this.cardPreview,
                    x: 465,
                    duration: 100,
                    ease: 'Linear',
                    yoyo: false, // Don't yoyo (return to start position) after tween ends
                    repeat: 0
                });
                isCardPreviewActive = true;
                tween.play();
            }
        });

        // Hide cardPreview on pointerout if not dragging
        scene.input.on('pointerup', (event, gameObjects) => {
            // if (gameObjects.length > 0 && 
            //     gameObjects[0].type === "Image" &&
            //     gameObjects[0].data.list.name !== "cardBack") {
            //     scene.cardPreview.setVisible(false);
            // }
        });

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            //scene.cardPreview.setVisible(false);
        })
        scene.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xf0ccde);
            scene.children.bringToTop(gameObject);
        })

        scene.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setTint();
            if(!dropped) {
                gameObject.x = gameObject.input.dragStartX; 
                gameObject.y = gameObject.input.dragStartY;
            }
        }) 

        // Card drop
        // 'drop' *** built-in function in Phaser 3
        // gameObject: Card
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            //console.log("AAAAAA: " + gameObject.getData("test"));
            let isMatch = false;
            let cardType = "";
            switch(dropZone.name) {
                case "dropZone1": //天
                    // Check if matches the elements on the authorCard
                    if(gameObject.getData("id").includes("H")) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else if ((!gameObject.getData("id").includes("I") || !scene.GameHandler.playerSkyElements.includes(gameObject.getData("element")))) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else {
                        isMatch = true;
                        cardType = "ICard";
                    }
                    scene.GameHandler.skyCardZoneName = gameObject.getData("id");
                    break;
                case "dropZone2": //地
                    if(gameObject.getData("id").includes("H")) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else if(!gameObject.getData("id").includes("I") || !scene.GameHandler.playerGroundElements.includes(gameObject.getData("element"))) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else {
                        isMatch = true;
                        cardType = "ICard";
                    }
                    scene.GameHandler.groundCardZoneName = gameObject.getData("id");
                    break;
                case "dropZone3": //人
                    if(gameObject.getData("id").includes("H")) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else if(!gameObject.getData("id").includes("I") || !scene.GameHandler.playerPersonElements.includes(gameObject.getData("element"))) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else {
                        isMatch = true;
                        cardType = "ICard";
                    }
                    scene.GameHandler.personCardZoneName = gameObject.getData("id");
                    break;
                case "dropZone4": //日
                    if(gameObject.getData("id").includes("I")) {
                        isMatch = false;
                        cardType = "cardBack";
                    } else if(gameObject.getData("id").includes("H")) {
                        isMatch = false;
                        cardType = "HCard";
                    }
                    scene.GameHandler.sunCardZoneName = gameObject.getData("id");
                    break;
            }
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
                let authorBuffPoints = 0;
                let elementID = 99;
                if(gameObject.getData("id").includes("I")) {
                    switch(gameObject.getData("element")) {
                        case "火":
                            elementID = 0;
                            break;
                        case "水":
                            elementID = 1;
                            break;
                        case "木":
                            elementID = 2;
                            break;
                        case "金":
                            elementID = 3;
                            break;
                        case "土":
                            elementID = 4;
                            break;
                        default:
                            break;
                    }
                    authorBuffPoints = scene.GameHandler.authorBuffs[elementID];
                }
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;

                // calculatePoints does not affect dropZone 4
                if(isMatch) {
                    console.log("gameObject.getData(points)" + gameObject.getData("points"))
                    //dropZone.data.list.cards++;
                    scene.input.setDraggable(gameObject, false);
                    scene.socket.emit('cardPlayed', gameObject.getData("id"), scene.socket.id, dropZone.name, scene.GameHandler.currentRoomID, cardType);
                    scene.socket.emit('calculatePoints', gameObject.getData("points") + authorBuffPoints, scene.socket.id, dropZone.name, scene.GameHandler.currentRoomID, cardType);
                    scene.socket.emit('dealOneCardInServer', scene.socket.id, gameObject.getData("id"), scene.GameHandler.currentRoomID);
                } else {
                    //dropZone.data.list.cards++;
                    cardType === "cardBack" && gameObject.setTexture('H001B');
                    scene.input.setDraggable(gameObject, false);
                    scene.socket.emit('cardPlayed', gameObject.getData("id"), scene.socket.id, dropZone.name, scene.GameHandler.currentRoomID, cardType);
                    scene.socket.emit('calculatePoints', 0 + authorBuffPoints, scene.socket.id, dropZone.name, scene.GameHandler.currentRoomID, cardType);
                    scene.socket.emit('dealOneCardInServer', scene.socket.id, gameObject.getData("id"), scene.GameHandler.currentRoomID);
                }
                scene.socket.emit('addCardCount', scene.socket.id, scene.GameHandler.opponentID, scene.GameHandler.currentRoomID);
                console.log(dropZone);
                console.log(dropZone.data.list.cards);

                //const RNG = Math.floor(Math.random() * 3) + 1;
                //scene.sound.play(`flipCard${RNG}`);
            } 
            else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY; 
            }
        })

        //Debug
        scene.input.on('pointerdown', (pointer) => {
            // Get the x and y coordinates of the mouse pointer
            const x = pointer.x;
            const y = pointer.y;
        
            // Show the coordinates on the console
            //console.log(`Clicked at X: ${x}, Y: ${y}`);
        });
    }
}