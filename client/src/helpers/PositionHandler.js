export default class PositionHandler {
    // 大廳
    static createRoomText = { x: 260, y: 380 } // 建立房間
    static joinRoomText = { x: 260, y: 430 } // 加入房間
    static roomNumberText = { x: 440, y: 20 } // 房間編號
    static inputText = { x: 330, y: 510 } // (輸入房間編號位置)
    static inputTextRectangle = { x: 300, y: 500 }

    // 對局資訊
    static opponentPointText = { x: 350, y: 200 } // 靈感值: x
    static playerNumberText = { x: 350, y: 250 } // "你是: 玩家1 / 2
    static playerTurnText = { x: 350, y: 300 } // 你的回合 / 對方的回合
    static whoWinText = { x: 350, y: 450 } // 玩家1勝利 / 平手
    static winScoreText = { x: 350, y: 500 } // 總分
    static playerPointText = { x: 350, y: 550 } // 靈感值: x

    static rollDiceText1 = { x: 350, y: 570 }
    static rollDiceText2 = { x: 350, y: 600 }

    // 場景
    static outlineGrid = { x: 220, y: 270, width: 330, height: 430 }

    static playerHandArea = { x: 200, y: 880, width: 350, height: 230 }
    static opponentHandArea = { x: 200, y: -85, width: 350, height: 230 }

    static playerDeckArea = { x: 375, y: 695, width: 78, height: 115 }
    static playerRubbishBinArea = { x: 470, y: 695, width: 78, height: 115 }

    static opponentDeckArea = { x: 375, y: 112, width: 78, height: 115 }
    static opponentRubbishBinArea = { x: 470, y: 112, width: 78, height: 115 }

    // dropZone
    static dropZoneConfigs = [
        { x: 189, y: 458, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone1" },
        { x: 90, y: 575, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone2" },
        { x: 280, y: 575, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone3" },
        { x: 189, y: 690, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone4" },
    ]
}
