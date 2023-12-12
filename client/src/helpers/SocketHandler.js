import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {

        scene.socket = io('http://localhost:3000/');

        scene.socket.on('connect', () => {
            console.log('Connected!');
            scene.socket.emit('dealDeck', scene.socket.id);
        });

        scene.socket.on('buildPlayerTurnText', () => {
            scene.UIHandler.buildPlayerTurnText(); 
        })
        scene.socket.on('setPlayerTurnText', () => {
            let b = scene.GameHandler.getCurrentTurn();
            console.log(b);
            scene.UIHandler.setPlayerTurnText(b); 
        })
        scene.socket.on('buildPlayerNumberText', (playerNumber) => {
            scene.UIHandler.buildPlayerNumberText(playerNumber);
        })
        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
            scene.GameHandler.getCurrentTurn();
        })

        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                //scene.DeckHandler.dealCard(200, 200, "cardBack", "playerCard");
                //scene.DeckHandler.dealCard(200, 360, "cardBack", "opponentCard");
                scene.dealCards.setInteractive();
                scene.dealCards.setColor('#00ffff');
            }
        });

        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
            scene.GameHandler.getCurrentTurn();
        })


        scene.socket.on('dealCards', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                for (let i in cards) {
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(55 + (i * 55), 760, cards[i], "playerCard").setScale(0.26));
                }
            } else {
                for (let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(85 + (i * 35), 0, "cardBack", "opponentCard").setScale(0.26));
                }
            }
        })

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
                        scene.DeckHandler.dealCard(189, 345, cardName, "opponentCard").setScale(0.26);
                        break;
                    case "dropZone2":
                        console.log("EE");
                        scene.DeckHandler.dealCard(90, 220, cardName, "opponentCard").setScale(0.26);
                        break;
                    case "dropZone3":
                        console.log("FF");
                        scene.DeckHandler.dealCard(280, 220, cardName, "opponentCard").setScale(0.26);
                        break;
                }
                //scene.dropZone.data.values.cards++; 
            }
        })

    }
}