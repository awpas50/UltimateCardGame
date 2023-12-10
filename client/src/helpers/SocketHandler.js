import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {
        scene.socket = io('http://localhost:3000');

        scene.socket.on('connect', () => {
            console.log('connected');
            scene.socket.emit('dealDeck', scene.socket.id);
        })

        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('connect', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if(gameState === "Initializing") {
                scene.DeckHandler.dealCard(200, 860, "cardBack", "playerCard");
                scene.DeckHandler.dealCard(200, 135, "cardBack", "opponentCard");
                scene.dealCards.setInteractive();
                scene.dealCards.setColor('#00ffff');
            }
        })

        scene.socket.on('dealCards', (socketId, cards) => {
            if(socketId === scene.socket.id) {
                for(let i in cards) {
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(155 + (i * 155), 860, cards[i], "playerCard"));
                }
            } else {
                for(let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(155 + (i * 155), 135, "cardBack", "opponentCard"));
                }
            }
        })

        scene.socket.on('cardPlayed', (cardName, socketId) => {
            if(socketId !== scene.socket.id) {
                scene.GameHandler.opponentHand.shift().destroy();
                scene.DeckHandler.dealCard(scene.dropZone.x, scene.dropZone.y, cardName, "opponentCard");
            }
        })
    }
}