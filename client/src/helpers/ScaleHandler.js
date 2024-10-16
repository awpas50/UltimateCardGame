export default class ScaleHandler {
    // X正數Y負數: 卡牌朝下反轉
    // 場上作者卡
    static playerAuthorCard = { scaleX: 0.26, scaleY: 0.26 }
    static opponentAuthorCard = { scaleX: 0.26, scaleY: -0.26 }

    // 已打出的卡牌
    static playerInSceneCard = { scaleX: 0.26, scaleY: 0.26 }
    static opponentInSceneCard = { scaleX: 0.26, scaleY: -0.26 }

    // 手牌
    static playerInHandCard = { scaleX: 0.35, scaleY: 0.35 }
    static opponentInHandCard = { scaleX: 0.26, scaleY: -0.26 }

    // 牌背
    static opponentCardBack = { scaleX: 0.26, scaleY: 0.26 }

    // 預覽 / 題目卡
    static cardPreview = { scale: 0.7 }
    static questionCard = { scale: 0.7 }
}
