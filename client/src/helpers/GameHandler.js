import { WCard_Data_24256 } from "../scenes/game.js"

export default class GameHandler {
    constructor(scene) {
        this.currentRoomID = ""
        this.currentPlayersInRoom = []
        this.opponentID = []

        this.gameState = "Initializing"
        this.isMyTurn = false
        this.hasPlayedCardThisTurn = false
        this.playerDeck = []
        this.opponentDeck = []
        this.playerHand = []
        // this.opponentHand = []

        this.skyCardZoneName = ""
        this.groundCardZoneName = ""
        this.personCardZoneName = ""
        this.sunCardZoneName = ""

        //稀有度
        this.playerAuthorRarity = 1
        this.opponentAuthorRarity = 1

        //天地人屬性
        this.playerSkyElements = []
        this.playerGroundElements = []
        this.playerPersonElements = []

        this.opponentSkyElements = []
        this.opponentGroundElements = []
        this.opponentPersonElements = []

        //加成 [5種屬性]
        this.authorBuffs = []
        this.authorBuffPoint = 0
        //天地人
        this.playerSkyPoint = 0
        this.playerGroundPoint = 0
        this.playerPersonPoint = 0

        this.opponentSkyPoint = 0
        this.opponentGroundPoint = 0
        this.opponentPersonPoint = 0

        //總靈感值
        this.playerTotalPoints = 0
        this.opponentTotalPoints = 0

        //總分
        this.playerTotalWinScore = 0
        this.opponentTotalWinScore = 0

        //擲骰
        this.playerDiceValue = 0
        this.opponentDiceValue = 0

        //基礎分數:8張卡,8分
        this.baseTotalScoreWillGet = 8

        //技能
        this.ability = ""
        this.target = ""
        this.targetRules = ""
        //技能 (對手)
        this.opponentAbility = ""
        this.opponentTarget = ""
        this.opponentTargetRules = ""

        this.setPlayerAuthorData = (authorCardName) => {
            this.playerSkyElements = WCard_Data_24256[authorCardName].sky
            this.playerGroundElements = WCard_Data_24256[authorCardName].ground
            this.playerPersonElements = WCard_Data_24256[authorCardName].person

            console.log("playerSkyElements: " + this.playerSkyElements)
            console.log("playerGroundElements: " + this.playerGroundElements)
            console.log("playerPersonElements: " + this.playerPersonElements)

            this.authorBuffs = WCard_Data_24256[authorCardName].authorBuffs
            this.ability = WCard_Data_24256[authorCardName].ability || null
            this.target = WCard_Data_24256[authorCardName].target || null
            this.targetRules = WCard_Data_24256[authorCardName].targetRules || null
        }

        this.setOpponentAuthorData = (authorCardName) => {
            this.opponentSkyElements = WCard_Data_24256[authorCardName].sky
            this.opponentGroundElements = WCard_Data_24256[authorCardName].ground
            this.opponentPersonElements = WCard_Data_24256[authorCardName].person

            console.log("opponentSkyElements: " + this.opponentSkyElements)
            console.log("opponentGroundElements: " + this.opponentGroundElements)
            console.log("opponentPersonElements: " + this.opponentPersonElements)

            this.opponentAbility = WCard_Data_24256[authorCardName].ability || null
            this.opponentTarget = WCard_Data_24256[authorCardName].target || null
            this.opponentTargetRules = WCard_Data_24256[authorCardName].targetRules || null
        }

        this.addAuthorBuffsPoints = (points) => {
            this.authorBuffPoint += points
        }

        this.setPlayerAuthorRarity = (authorCardName) => {
            this.playerAuthorRarity = WCard_Data_24256[authorCardName].rarity
        }
        this.setOpponentAuthorRarity = (authorCardName) => {
            this.opponentAuthorRarity = WCard_Data_24256[authorCardName].rarity
        }

        this.setTurn = (turn) => {
            this.isMyTurn = turn
            console.log("isMyTurn: " + this.isMyTurn)
        }

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn
            console.log("isMyTurn: " + this.isMyTurn)
        }

        this.getCurrentTurn = () => {
            return this.isMyTurn
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState
            console.log("GameState: " + this.gameState)
        }

        this.setPlayerSkyPoint = (point) => {
            this.playerSkyPoint = point
        }
        this.setPlayerGroundPoint = (point) => {
            this.playerGroundPoint = point
        }
        this.setPlayerPersonPoint = (point) => {
            this.playerPersonPoint = point
        }

        this.setOpponentSkyPoint = (point) => {
            this.opponentSkyPoint = point
        }
        this.setOpponentGroundPoint = (point) => {
            this.opponentGroundPoint = point
        }
        this.setOpponentPersonPoint = (point) => {
            this.opponentPersonPoint = point
        }

        this.setPlayerTotalPoint = () => {
            this.playerTotalPoints = this.playerSkyPoint + this.playerGroundPoint + this.playerPersonPoint + this.authorBuffPoint
        }
        this.setOpponentTotalPoint = () => {
            this.opponentTotalPoints =
                this.opponentSkyPoint + this.opponentGroundPoint + this.opponentPersonPoint + this.authorBuffPoint
        }

        this.getPlayerTotalPoint = () => {
            return this.playerTotalPoints
        }
        this.getOpponentTotalPoint = () => {
            return this.opponentTotalPoints
        }

        // this.setPlayerTotalWinScore = () => {
        //     let multiplier = 1
        //     this.playerTotalWinScore = this.baseTotalScoreWillGet * multiplier
        //     console.log("Player Win Score: " + this.playerTotalWinScore + " " + "Opponent Win Score: " + this.opponentTotalWinScore)
        // }
        // this.setOpponentTotalWinScore = () => {
        //     this.opponentTotalWinScore = this.opponentSkyPoint + this.opponentGroundPoint + this.opponentPersonPoint
        //     console.log("Player Win Score: " + this.playerTotalWinScore + " " + "Opponent Win Score: " + this.opponentTotalWinScore)
        // }
    }
}
