import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {
        // Heroku URL
        // Default: localhost:3000 is where the server is.
        scene.socket = io('https://ultimate-card-game-f26046605e38.herokuapp.com');
        //scene.socket = io('http://localhost:3000/');

        //Create or join a room
        // function generateRoomId() {
        //     const timestamp = Date.now().toString();
        //     const randomNum = Math.floor(Math.random() * 1000).toString();
        //     return `${timestamp}_${randomNum}`;
        // }
        // const roomId = generateRoomId(); 

        //socket.emit('createRoom', roomId);

        scene.socket.on('connect', () => {
            console.log('Connected!');
            scene.socket.emit('HelloWorld');
            //scene.socket.emit('dealDeck', scene.socket.id);
        });

        //Called in server.js (socket.emit)
        scene.socket.on('buildPlayerTurnText', () => {
            scene.UIHandler.buildPlayerTurnText(); 
        })
        //Called in server.js (socket.emit)
        scene.socket.on('setPlayerTurnText', () => {
            let b = scene.GameHandler.getCurrentTurn();
            scene.UIHandler.setPlayerTurnText(b); 
        })


        //Called in server.js (socket.emit)
        scene.socket.on('buildPlayerPointText', () => {
            scene.UIHandler.buildPlayerPointText(); 
        })
        scene.socket.on('setPlayerPointText', () => {
            let points = scene.GameHandler.getPlayerTotalPoint();
            scene.UIHandler.setPlayerPointText(points); 
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
                scene.UIHandler.ActivateGameText();
            }
        });

        // Called in InteractiveHandler.js
        scene.socket.on('addICardsHCardsInScene', (socketId, cards) => {
            // checks if the socketId matches the local client's socket ID
            if (socketId === scene.socket.id) {
                for (let i in cards) {
                    //card[i]: card name
                    // Use card name to retrieve card data
                    let card;
                    if(cards[i].includes("I")) {
                        card = scene.DeckHandler.InstantiateCard(55 + (i * 55), 760, "ICard", cards[i], "playerCard").setScale(0.26);
                    }
                    if(cards[i].includes("H")) {
                        card = scene.DeckHandler.InstantiateCard(55 + (i * 55), 760, "HCard", cards[i], "playerCard").setScale(0.26);
                    }
                    scene.GameHandler.playerHand.push(card);
                    // let testMessage = card.getData('test');
                    // console.log(testMessage); // This should output: "test message"
                } 
                console.log(scene.GameHandler.playerHand);
            } else {
                for (let i in cards) {
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.InstantiateCard(85 + (i * 35), 0, "cardBack", "cardBack", "opponentCard").setScale(0.26));
                }
            }
        })

        scene.socket.on('addWCardsInScene', (socketId, card) => {
            //Author card
            if (socketId === scene.socket.id) {
                scene.DeckHandler.InstantiateCard(189, 585, "WCard", card, "authorCard").setScale(0.26, 0.26); //Player side
            } else {
                scene.DeckHandler.InstantiateCard(189, 230, "WCard", card, "authorCard").setScale(0.26, -0.26); //Opposite side
            }
        })

        scene.socket.on('setAuthorElements', (authorCardName) => {
            //Author card
            scene.GameHandler.setAuthorElements(authorCardName); //Player side
            scene.GameHandler.setAuthorBuffs(authorCardName); //Player side
        })
        scene.socket.on('setAuthorRarity', (socketId, authorCardName) => {
            //Author card
            if (socketId === scene.socket.id) {
                scene.GameHandler.setPlayerAuthorRarity(authorCardName); //Player side
                console.log("playerAuthorRarity: " + scene.GameHandler.playerAuthorRarity);
            } else {
                scene.GameHandler.setOpponentAuthorRarity(authorCardName); //Opponent side
                console.log("opponentAuthorRarity: " + scene.GameHandler.opponentAuthorRarity);
            }
        })
        scene.socket.on('RollDice', (socketId, roll1, roll2) => {
            
            if (socketId === scene.socket.id) {
                // Display the results
                console.log("playerDiceValue: " + roll1); 
                console.log("opponentDiceValue: " + roll2);

                scene.GameHandler.playerDiceValue = roll1;
                scene.GameHandler.opponentDiceValue = roll2;

                scene.UIHandler.setRollDiceText(roll2, roll1); 
            }
            else { // Flip the result
                // Display the results
                console.log("playerDiceValue: " + roll2); 
                console.log("opponentDiceValue: " + roll1);

                scene.GameHandler.playerDiceValue = roll2;
                scene.GameHandler.opponentDiceValue = roll1;

                scene.UIHandler.setRollDiceText(roll2, roll1);
            }
            
        })
        scene.socket.on('decideWhichPlayerfirstTurn', (socketId) => {
            if(scene.GameHandler.playerAuthorRarity > scene.GameHandler.opponentAuthorRarity) {
                scene.GameHandler.changeTurn();
                scene.GameHandler.getCurrentTurn();
            }
            else if(scene.GameHandler.playerAuthorRarity === scene.GameHandler.opponentAuthorRarity) {
                if(scene.GameHandler.playerDiceValue > scene.GameHandler.opponentDiceValue) {
                    scene.GameHandler.changeTurn();
                    scene.GameHandler.getCurrentTurn();
                }
            }
        })

        // Called in InteractiveHandler.js
        // Where does Player 2 cards display in Player 1 scene??
        scene.socket.on('cardPlayed', (cardName, socketId, dropZoneName) => {
            //console.log("cardName:", cardName);
            //console.log("socketId:", socketId);
            //console.log("dropZoneID:", dropZoneName);
            if (socketId !== scene.socket.id) {
                scene.GameHandler.opponentHand.shift().destroy();
                switch(dropZoneName) {
                    case "dropZone1": //天
                        scene.DeckHandler.InstantiateCard(189, 345, "ICard", cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                    case "dropZone2": //地
                        scene.DeckHandler.InstantiateCard(90, 220, "ICard", cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                    case "dropZone3": //人
                        scene.DeckHandler.InstantiateCard(280, 220, "ICard", cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                    case "dropZone4": //日
                        scene.DeckHandler.InstantiateCard(189, 100, "HCard", cardName, "opponentCard").setScale(0.26, -0.26);
                        break;
                }
            }
        })
        scene.socket.on('calculatePoints', (pointsString, socketId, dropZoneName) => {
            let points = parseInt(pointsString);
            if (socketId === scene.socket.id) {
                switch(dropZoneName) {
                    case "dropZone1": //天
                        scene.GameHandler.setPlayerSkyPoint(points);
                        break;
                    case "dropZone2": //地
                        scene.GameHandler.setPlayerGroundPoint(points);
                        break;
                    case "dropZone3": //人
                        scene.GameHandler.setPlayerPersonPoint(points);
                        break;
                }
            }
            else {
                switch(dropZoneName) {
                    case "dropZone1": //天
                        scene.GameHandler.setOpponentSkyPoint(points);
                        break;
                    case "dropZone2": //地
                        scene.GameHandler.setOpponentGroundPoint(points);
                        break; 
                    case "dropZone3": //人
                        scene.GameHandler.setOpponentPersonPoint(points);
                        break;
                }
                
            }
            scene.GameHandler.setPlayerTotalPoint();
            scene.GameHandler.setOpponentTotalPoint();
        })

        // Called after scene.socket.on('cardPlayed')
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
            scene.GameHandler.getCurrentTurn(); 
        })
    }
}