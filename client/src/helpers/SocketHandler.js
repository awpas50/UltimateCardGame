import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {

        scene.socket = io('http://localhost:3000/');

        scene.socket.on('connect', () => {
            console.log('Connected!');
            scene.socket.emit('dealDeck', scene.socket.id);
        });

        scene.socket.on('setPlayerNumberText', (playerNumber) => {
            scene.UIHandler.buildPlayerNumberText(playerNumber);
        })
        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
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
        })


        scene.socket.on('dealCards', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                for (let i in cards) {
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(155 + (i * 75), 760, cards[i], "playerCard").setScale(0.4));
                }
            } else {
                for (let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(155 + (i * 75), 35, "cardBack", "opponentCard").setScale(0.4));
                }
            }
        })

        // Where does Player 2 cards display in Player 1 scene??
        scene.socket.on('cardPlayed', (cardName, socketId) => {
            if (socketId !== scene.socket.id) {
                scene.GameHandler.opponentHand.shift().destroy();
                scene.DeckHandler.dealCard((scene.dropZone.x) + (scene.dropZone.data.values.cards * 50), scene.dropZone.y + 50, cardName, "opponentCard").setScale(0.4);
                scene.dropZone.data.values.cards++; 
            }
        })

    }
}