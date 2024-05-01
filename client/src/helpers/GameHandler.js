import {WCard_Data_23246} from "../scenes/game.js";

export default class GameHandler {
    constructor(scene) {
        this.currentRoomID = "";
        this.currentPlayersInRoom = [];
        this.opponentID = [];

        this.gameState = "Initializing";
        this.isMyTurn = false;
        this.playerDeck = [];
        this.opponentDeck = [];
        this.playerHand = [];
        this.opponentHand = [];

        //稀有度
        this.playerAuthorRarity = 1;
        this.opponentAuthorRarity = 1;

        //天地人屬性
        this.playerSkyElements = [];
        this.playerGroundElements = [];
        this.playerPersonElements = [];
        //加成
        this.authorBuffs = [];
        //天地人
        this.playerSkyPoint = 0;
        this.playerGroundPoint = 0;
        this.playerPersonPoint = 0;

        this.opponentSkyPoint = 0;
        this.opponentGroundPoint = 0;
        this.opponentPersonPoint = 0;

        //總靈感值
        this.playerTotalPoints = 0;
        this.opponentTotalPoints = 0;

        //總分
        this.playerTotalGameScore = 0;
        this.opponentTotalGameScore = 0;

        //擲骰子
        this.playerDiceValue = 0;
        this.opponentDiceValue = 0;

        this.setAuthorElements = (authorCardName) => {
            this.playerSkyElements = WCard_Data_23246[authorCardName].sky;
            this.playerGroundElements = WCard_Data_23246[authorCardName].ground;
            this.playerPersonElements = WCard_Data_23246[authorCardName].person;

            console.log("playerSkyElements: " + this.playerSkyElements);
            console.log("playerGroundElements: " + this.playerGroundElements);
            console.log("playerPersonElements: " + this.playerPersonElements);
        }

        this.setAuthorBuffs = (authorCardName) => {
            this.authorBuffs = WCard_Data_23246[authorCardName].authorBuffs;
        }

        this.setPlayerAuthorRarity = (authorCardName) => {
            this.playerAuthorRarity = WCard_Data_23246[authorCardName].rarity;
        }
        this.setOpponentAuthorRarity = (authorCardName) => {
            this.opponentAuthorRarity = WCard_Data_23246[authorCardName].rarity;
        }

        this.changeTurn = () => { 
            this.isMyTurn = !this.isMyTurn; 
            console.log("isMyTurn: " + this.isMyTurn);
        }

        this.getCurrentTurn = () => { 
            return this.isMyTurn;
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
            console.log("GameState: " + this.gameState);
        }

        this.setPlayerSkyPoint = (point) => {
            this.playerSkyPoint = point;
        }
        this.setPlayerGroundPoint = (point) => {
            this.playerGroundPoint = point;
        }
        this.setPlayerPersonPoint = (point) => {
            this.playerPersonPoint = point;
        }

        this.setOpponentSkyPoint = (point) => {
            this.opponentSkyPoint = point;
        }
        this.setOpponentGroundPoint = (point) => {
            this.opponentGroundPoint = point;
        }
        this.setOpponentPersonPoint = (point) => {
            this.opponentPersonPoint = point;
        }

        this.setPlayerTotalPoint = () => {
            this.playerTotalPoints = this.playerSkyPoint + this.playerGroundPoint + this.playerPersonPoint;
            console.log("Player: " + this.playerTotalPoints + " " + "Opponent: " + this.opponentTotalPoints);
        }
        this.setOpponentTotalPoint = () => {
            this.opponentTotalPoints = this.opponentSkyPoint + this.opponentGroundPoint + this.opponentPersonPoint;
            console.log("Player: " + this.playerTotalPoints + " " + "Opponent: " + this.opponentTotalPoints);
        }

        this.getPlayerTotalPoint = () => {
            return this.playerTotalPoints;
        }
    }
}