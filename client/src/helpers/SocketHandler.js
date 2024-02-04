import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {

        scene.socket = io('http://localhost:3000/');

        scene.socket.on('connect', () => {
            console.log('Connected!');
            scene.socket.emit('dealDeck', scene.socket.id);
        });

        //Called in server.js (socket.emit)
        scene.socket.on('buildPlayerTurnText', () => {
            scene.UIHandler.buildPlayerTurnText(); 
        })
        //Called in server.js (socket.emit)
        scene.socket.on('setPlayerTurnText', () => {
            let b = scene.GameHandler.getCurrentTurn();
            console.log(b);
            scene.UIHandler.setPlayerTurnText(b); 
        })
        //Called in server.js (socket.emit)
        scene.socket.on('buildPlayerNumberText', (playerNumber) => {
            scene.UIHandler.buildPlayerNumberText(playerNumber);
        })
        //Called in server.js (io.emit)
        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
            scene.GameHandler.getCurrentTurn();
        })

        // Called after socket.on('dealDeck') or socket.on('dealCards') in server.js
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                //scene.DeckHandler.dealCard(200, 200, "cardBack", "playerCard");
                //scene.DeckHandler.dealCard(200, 360, "cardBack", "opponentCard");
                scene.dealCardText.setInteractive();
                scene.dealCardText.setColor('#00ffff');
            }
        });

        // Called in InteractiveHandler.js
        scene.socket.on('addCardsInScene', (socketId, cards) => {
            // checks if the socketId matches the local client's socket ID
            if (socketId === scene.socket.id) {
                //Author card
                //scene.DeckHandler.dealCard(189, 645, "AuthorCard", "authorCard").setScale(0.26, 0.26);
                scene.add.image(189, 585, "W009").setScale(0.26); //player 1
                scene.add.image(189, 230, "W010").setScale(0.26, -0.26); //player 2
                for (let i in cards) { 
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.InstantiateCard(55 + (i * 55), 760, cards[i], "playerCard").setScale(0.26));
                }
            } else {
                scene.add.image(189, 585, "W010").setScale(0.26); // player 2
                scene.add.image(189, 230, "W009").setScale(0.26, -0.26); // player 1
                //scene.DeckHandler.dealCard(189, 220, "AuthorCard2", "authorCard").setScale(0.26, -0.26);
                for (let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.InstantiateCard(85 + (i * 35), 0, "cardBack", "opponentCard").setScale(0.26));
                }
            }
        })

        // Called in InteractiveHandler.js
        // Where does Player 2 cards display in Player 1 scene??
        scene.socket.on('cardPlayed', (cardName, socketId, dropZoneName) => {
            console.log("cardName:", cardName);
            console.log("socketId:", socketId);
            console.log("dropZoneID:", dropZoneName);
            if (socketId !== scene.socket.id) {
                scene.GameHandler.opponentHand.shift().destroy();
                switch(dropZoneName) {
                    case "dropZone1":
                        console.log("DD");
                        scene.DeckHandler.InstantiateCard(189, 345, cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                    case "dropZone2":
                        console.log("EE"); 
                        scene.DeckHandler.InstantiateCard(90, 220, cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                    case "dropZone3":
                        console.log("FF");
                        scene.DeckHandler.InstantiateCard(280, 220, cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                }
            }
        })

        // Called after scene.socket.on('cardPlayed')
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
            scene.GameHandler.getCurrentTurn(); 
        })
    }
}