export default class InteractiveHandler {
    constructor(scene) {
        // When clicking on a particular text, perform certain interaction
        scene.dealCardText.on('pointerdown', () => {
            scene.socket.emit("dealCards", scene.socket.id);
            scene.dealCardText.disableInteractive();

        })

        // Card color
        scene.dealCardText.on('pointerover', () => {
            scene.dealCardText.setColor('#fff5fa');
        })
        scene.dealCardText.on('pointerout', () => {
            scene.dealCardText.setColor('#00ffff');
        })

        // Section: Card preview
        // Create cardPreview on pointerdown
        scene.cardPreview = scene.add.image(0, 0, "I001");
        scene.cardPreview.setVisible(false);

        scene.input.on('pointerdown', (event, gameObjects) => {
            // Check if gameObject is defined
            let pointer = scene.input.activePointer;
            if (!gameObjects || gameObjects.length == 0) {
                return;
            }
            if (gameObjects[0].type === "Image" &&
                gameObjects[0].data.list.name !== "cardBack") {
                    scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY - 200, gameObjects[0].data.values.sprite).setScale(1, 1);
                    console.log(gameObjects);
                }
            
        });

        // Hide cardPreview on pointerout if not dragging
        scene.input.on('pointerup', (event, gameObjects) => {
            if (gameObjects.length > 0 && 
                gameObjects[0].type === "Image" &&
                gameObjects[0].data.list.name !== "cardBack") {
                scene.cardPreview.setVisible(false);
            }
        });

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            scene.cardPreview.setVisible(false);
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
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                //scene.dropZone.data.values.cards++;
                scene.input.setDraggable(gameObject, false);

                console.log(scene.UIHandler.getDropZone1);
                scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id, dropZone.name);
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
            console.log(`Clicked at X: ${x}, Y: ${y}`);
        });
    }
}