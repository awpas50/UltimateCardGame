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

        // 打出的卡
        this.playerInSceneElement = [null, null, null]
        this.playerInSceneElementCalculator = [null, null, null]
        this.playerInSceneIPointCalculator = [null, null, null]
        this.playerInSceneSeriesCalculator = [null, null, null]
        this.playerInSceneRarityCalculator = [null, null, null]

        this.opponentInSceneElement = [null, null, null]
        this.opponentInSceneElementCalculator = [null, null, null]
        this.opponentInSceneIPointCalculator = [null, null, null]
        this.opponentInSceneSeriesCalculator = [null, null, null]
        this.opponentInSceneRarityCalculator = [null, null, null]

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

        //技能
        this.playerWCardId = ""
        this.ability = ""
        this.target = ""
        this.targetRules = ""
        this.hasGlobalEffect = false
        //技能 (對手)
        this.opponentWCardId = ""
        this.opponentAbility = ""
        this.opponentTarget = ""
        this.opponentTargetRules = ""
        this.opponentHasGlobalEffect = false

        this.setPlayerAuthorData = (authorCardName) => {
            this.playerWCardId = WCard_Data_24256[authorCardName].ID
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
            this.hasGlobalEffect = WCard_Data_24256[authorCardName].globalEffect || false
        }

        this.setOpponentAuthorData = (authorCardName) => {
            this.opponentWCardId = WCard_Data_24256[authorCardName].ID
            this.opponentSkyElements = WCard_Data_24256[authorCardName].sky
            this.opponentGroundElements = WCard_Data_24256[authorCardName].ground
            this.opponentPersonElements = WCard_Data_24256[authorCardName].person

            console.log("opponentSkyElements: " + this.opponentSkyElements)
            console.log("opponentGroundElements: " + this.opponentGroundElements)
            console.log("opponentPersonElements: " + this.opponentPersonElements)

            this.opponentAbility = WCard_Data_24256[authorCardName].ability || null
            this.opponentTarget = WCard_Data_24256[authorCardName].target || null
            this.opponentTargetRules = WCard_Data_24256[authorCardName].targetRules || null
            this.opponentHasGlobalEffect = WCard_Data_24256[authorCardName].globalEffect || false
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
        this.clearInSceneCardInfo = () => {
            this.playerInSceneElementCalculator = [null, null, null]
            this.playerInSceneIPointCalculator = [null, null, null]
            this.playerInSceneSeriesCalculator = [null, null, null]
            this.playerInSceneRarityCalculator = [null, null, null]

            this.opponentInSceneElementCalculator = [null, null, null]
            this.opponentInSceneIPointCalculator = [null, null, null]
            this.opponentInSceneSeriesCalculator = [null, null, null]
            this.opponentInSceneRarityCalculator = [null, null, null]
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
    }
}
