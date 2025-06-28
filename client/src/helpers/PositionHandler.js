export default class PositionHandler {
    // 目錄 (可用以下標題搜尋):
    // 1.大廳
    // 2.對局
    // 3.角色卡編成
    // 4.排行榜

    // -----------------------------------------------------------------------
    // ------ 1.大廳
    static loginPreviewImage = { x: 300, y: 340 } // 封面圖
    static loginAccountText = { x: 225, y: 630 } // 帳號
    static loginText = { x: 280, y: 730 } // 登入
    static loginInputText = { x: 330, y: 690 } // (輸入帳號位置)
    static loginInputTextRectangle = { x: 300, y: 680 } // (輸入帳號位置 - Input field)

    static scoreBoardText = { x: 270, y: 280 } // 排行榜
    static authorDeckEditText = { x: 250, y: 330 } // 作者卡編成
    static createRoomText = { x: 260, y: 380 } // 建立房間
    static joinRoomText = { x: 260, y: 430 } // 加入房間
    static roomNumberText = { x: 440, y: 20 } // 房間編號
    static inputText = { x: 330, y: 510 } // (輸入房間編號位置)
    static inputTextRectangle = { x: 300, y: 500 } // (輸入房間編號位置 - Input field)

    // -----------------------------------------------------------------------
    // ------ 2.對局
    // 對局資訊 (從場景位置上到下排列)
    static opponentWinScoreText = { x: 350, y: 250 } // (對方)總分
    static opponentPointText = { x: 350, y: 300 } // 靈感值: x
    static playerNumberText = { x: 350, y: 350 } // "你是: 玩家1 / 2
    static playerTurnText = { x: 350, y: 400 } // 你的回合 / 對方的回合
    static whoWinText = { x: 350, y: 550 } // 玩家1勝利 / 平手
    static playerPointText = { x: 350, y: 630 } // 靈感值: x
    static playerWinScoreText = { x: 350, y: 680 } // (玩家)總分

    // 擲骰
    static rollDiceText1 = { x: 350, y: 710 }
    static rollDiceText2 = { x: 450, y: 710 }

    // 場景
    static outlineGrid = { x: 25, y: 100, width: 380, height: 470 }

    // 卡牌在手牌區的位置 (第一張牌的位置 / y軸 / 每張牌的間隔 / 波浪特效幅度)
    static playerCardInHandArea = { x: 75, y: 950, gap: 55, waveEffectOffset: [25, 15, 0, 0, 15, 25] }
    static opponentCardInHandArea = { x: 55, y: 25, gap: 45, waveEffectOffset: [0, 0, 0, 0, 0, 0] }

    // 手牌區(未打出卡牌前的位置)
    static playerHandArea = { x: 200, y: 980, width: 350, height: 130 }
    static opponentHandArea = { x: 200, y: 15, width: 350, height: 130 }

    // 抽牌區/棄牌區
    static playerDeckArea = { x: 400, y: 800, width: 78, height: 115 }
    static playerRubbishBinArea = { x: 500, y: 800, width: 78, height: 115 }

    static opponentDeckArea = { x: 400, y: 155, width: 78, height: 115 }
    static opponentRubbishBinArea = { x: 500, y: 155, width: 78, height: 115 }

    // dropZone (玩家場上卡牌位置) (天/地/人/日)
    static dropZoneConfigs = [
        { x: 176, y: 540, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone1" },
        { x: 70, y: 670, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone2" },
        { x: 280, y: 670, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone3" },
        { x: 176, y: 796, width: 330 / 3.25, height: 430 / 3.25, name: "dropZone4" },
    ]

    // 對手場上卡牌位置 (天/地/人/日)
    static opponentSkyCard = { x: 176, y: 410 }
    static opponentGroundCard = { x: 70, y: 286 }
    static opponentPersonCard = { x: 280, y: 286 }
    static opponentSunCard = { x: 176, y: 160 }

    //角色卡位置
    static playerAuthorCard = { x: 176, y: 670 }
    static opponentAuthorCard = { x: 176, y: 286 }

    //預覽
    static cardPreviewStart = { x: 1250, y: 400 }
    static cardPreviewEnd = { x: 750, y: 400 }

    //答案 (A,B,C,D)
    static answerA = { x: 355, y: 565 }
    static answerB = { x: 415, y: 565 }
    static answerC = { x: 475, y: 565 }
    static answerD = { x: 535, y: 565 }
    //計時
    static questionCardTimer = { x: 470, y: 630 } // 剩餘時間:
    //Toast
    static toast = { x: 300, y: 325 }
    static activeSkillToast = { x: 300, y: 175 }
    static topToast = { x: 300, y: 0 }

    // -----------------------------------------------------------------------
    // ------ 3.角色卡編成

    static authorCardEditSaveText = { x: 40, y: 30 }
    static authorCardEditQuitText = { x: 410, y: 30 }
    static authorCardEditInfo1 = { x: 40, y: 100 }
    static authorCardEditInfo2 = { x: 40, y: 135 }
    static authorCardEditInfo3 = { x: 40, y: 170 }

    // ------ 4.排行榜
    static scoreBoardQuitText = { x: 510, y: 30 }
    static scoreBoardLeft = { x: 160, y: 210 }
    static scoreBoardRight = { x: 390, y: 210 }
}
