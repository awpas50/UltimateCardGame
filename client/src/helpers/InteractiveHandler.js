import PositionHandler from "./PositionHandler.js"
import ScaleHandler from "./ScaleHandler.js"
import AbilityReader from "./AbilityReader"

export default class InteractiveHandler {
    constructor(scene) {
        // Section: Card preview
        // Create cardPreview on pointerdown
        let isCardPreviewActive = false
        let isSelectingCardWithActiveSkill = false

        let zIndex = 0
        let allowDragging = true
        this.cardPreview = null
        this.selectedWCard = null

        scene.input.on("pointerdown", (event, gameObjects) => {
            isSelectingCardWithActiveSkill && this.selectedWCard !== null
                ? handleClickInSkillSelectionMode(gameObjects)
                : handleClickInNormalMode(gameObjects)
            let pointer = scene.input.activePointer
        })

        const handleClickInNormalMode = (gameObjects) => {
            // If not clicking anything gameObjects returns empty array, like this....... []
            // ---------- Clicking anywhere else in the game, except cards: ----------
            if ((gameObjects.length == 0 || gameObjects[0].type === "Zone") && isCardPreviewActive && this.cardPreview !== null) {
                console.log("[click] disable card preview")
                this.cardPreview.setPosition(PositionHandler.cardPreviewStart.x, PositionHandler.cardPreviewStart.y)
                isCardPreviewActive = false
            }
            //  ---------- Not selected ----------
            if (!gameObjects || gameObjects.length == 0) {
                console.log("[click] Not clicking anything")
                return
            }
            if (gameObjects[0].type === "Container" && gameObjects[0].data.list.id === "toast") return
            //  ---------- Card preview ----------
            if (gameObjects[0].type === "Container" && gameObjects[0].data.list.id !== "cardBack") {
                const cardObject = gameObjects[0]
                const cardObjectData = cardObject.data.list
                scene.sound.play("dragCard")
                console.table(cardObjectData)
                zIndex = gameObjects[0].depth

                if (this.cardPreview === null) {
                    this.cardPreview = scene.add
                        .image(PositionHandler.cardPreviewEnd.x, PositionHandler.cardPreviewEnd.y, cardObjectData.sprite)
                        .setScale(ScaleHandler.cardPreview.scale)
                } else {
                    this.cardPreview.setTexture(cardObjectData.sprite).setScale(ScaleHandler.cardPreview.scale)
                    this.cardPreview.setPosition(PositionHandler.cardPreviewEnd.x, PositionHandler.cardPreviewEnd.y)
                }
                let tween = scene.tweens
                    .add({
                        targets: this.cardPreview,
                        x: 465,
                        duration: 100,
                        ease: "Linear",
                        yoyo: false, // Don't yoyo (return to start position) after tween ends
                        repeat: 0,
                    })
                    .play()
                isCardPreviewActive = true
            }
            // ---------- Preparation of using active skills (if author card has active skill) ----------
            if (gameObjects[0].type === "Container") {
                const cardObject = gameObjects[0]
                const cardObjectData = cardObject.data.list
                if (
                    !cardObjectData.id.includes("W") ||
                    cardObjectData.side !== "playerAuthorCard" ||
                    !cardObjectData.hasActiveSkill
                ) {
                    return
                }
                if (!scene.GameHandler.isMyTurn) {
                    scene.Toast.showToast("現在不是你的回合")
                    return
                } else if (!scene.QuestionCardHandler.hasAnsweredQuestion) {
                    scene.Toast.showToast("請先答題!")
                    return
                } else if (cardObjectData.abilityCharges <= 0) {
                    scene.Toast.showToast("已耗盡使用次數")
                    return
                }
                enterSkillSelectionMode(cardObject, "請選擇己方靈感卡")
            }
        }
        const handleClickInSkillSelectionMode = (gameObjects) => {
            // If not clicking anything gameObjects returns empty array, like this....... []
            // selected Wcard, and clicked another card
            //  ---------- Not selected ----------
            if (!gameObjects || gameObjects.length == 0) {
                console.log("[click] Not clicking anything")
                return
            }
            if (gameObjects[0].type !== "Container") return
            if (gameObjects[0].type === "Container" && gameObjects[0].data.list.id === "toast") return

            const cardObject = gameObjects[0]
            const cardObjectData = cardObject.data.list
            let selectedCardStatus = ""
            let selectedCardType = ""
            if (cardObjectData.side === "playerCard") {
                if (cardObjectData.activeState === "inHand") {
                    selectedCardStatus = "playerHand"
                    console.log("點中自己的卡 (手牌)")
                } else if (cardObjectData.activeState === "inScene") {
                    selectedCardStatus = "playerScene"
                    console.log("點中自己的卡 (場上)")
                } else console.log("點中自己的卡 (不符合條件)")
            } else if (cardObjectData.side === "opponentCard") {
                if (cardObjectData.activeState === "inHand") {
                    selectedCardStatus = "opponentHand"
                    console.log("點中對手的卡 (手牌)")
                } else if (cardObjectData.activeState === "inScene") {
                    selectedCardStatus = "opponentScene"
                    console.log("點中對手的卡 (場上)")
                } else console.log("對手的卡(不符合條件)")
            }

            if (cardObjectData.side === "opponentAuthorCard") {
                console.log("點中對手的卡 (作者卡)")
                selectedCardStatus = "opponentScene"
                selectedCardType = "WCard"
            } else if (cardObjectData.side === "playerAuthorCard") {
                console.log("點中自己 (作者卡)")
                selectedCardStatus = "playerScene"
                selectedCardType = "WCard"
                exitSkillSelectionMode()
                return
            }

            if (cardObjectData.id.includes("H")) {
                selectedCardType = "HCard"
            } else if (cardObjectData.id.includes("I")) {
                selectedCardType = "ICard"
            }
            console.log("selectedCardStatus:", selectedCardStatus)
            console.log("selectedCardType:", selectedCardType)
            // selected card that matches the requirements
            const target = scene.GameHandler.target
            const targetRules = scene.GameHandler.targetRules
            const element = AbilityReader.getValueByTag(target, "$element")
            const cardType = AbilityReader.getValueByTag(target, "$cardType")
            const range = AbilityReader.getMultipleValueByTag(targetRules, "$range")
            console.log("cardType:", cardType)
            console.log("range:", range)
            if (range.includes(selectedCardStatus) && cardType === selectedCardType) {
                const elementMap = {
                    火: 0,
                    水: 1,
                    木: 2,
                    金: 3,
                    土: 4,
                    無: 5,
                }
                scene.Toast.showToast(`靈感卡轉屬: ${cardObjectData.element} -> ${element}`)
                cardObject.getAt(1)?.setTexture(`extra_element_${elementMap[element]}`)
                cardObject.getAt(1)?.setVisible(true)
                cardObjectData.modifiedElement = element
                this.selectedWCard.data.list.abilityCharges--
                exitSkillSelectionMode()
            }
        }

        const enterSkillSelectionMode = (wCard, message = null) => {
            this.selectedWCard = wCard
            isSelectingCardWithActiveSkill = true
            const wCardData = wCard.data.list
            allowDragging = false
            if (message) {
                scene.Toast.showActiveSkillTipsToast(message)
            }
            // Animation
            scene.tweens
                .add({
                    targets: wCard,
                    y: wCardData.startY - 40,
                    duration: 100,
                    ease: "Linear",
                    yoyo: false, // Don't yoyo (return to start position) after tween ends
                    repeat: 0,
                })
                .play()
        }

        const exitSkillSelectionMode = () => {
            // Animation
            scene.tweens
                .add({
                    targets: this.selectedWCard,
                    y: this.selectedWCard.y + 40,
                    duration: 100,
                    ease: "Linear",
                })
                .play()
            // action
            isSelectingCardWithActiveSkill = false
            this.selectedWCard = null
            scene.Toast.hideActiveSkillTipsToast()
            allowDragging = true
        }

        scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (!allowDragging) {
                return
            }
            gameObject.x = dragX
            gameObject.y = dragY
        })
        scene.input.on("dragstart", (pointer, gameObject) => {
            console.log("[dragstart] gameObject: ", gameObject)
            if (this.selectedWCard) return
            if (gameObject.type === "Container") {
                gameObject.iterate((child) => {
                    if (child.setTint) {
                        child.setTint(0xf0ccde)
                    }
                })
            } else {
                gameObject.setTint(0xf0ccde)
            }
            scene.children.bringToTop(gameObject)
        })

        scene.input.on("dragend", (pointer, gameObject, dropped) => {
            if (gameObject.type === "Container") {
                gameObject.iterate((child) => {
                    if (child.setTint) {
                        child.setTint()
                    }
                })
            } else {
                gameObject.setTint()
            }
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
            if (!dropped && allowDragging) {
                gameObject.setDepth(zIndex)
            }
        })

        // Card drop
        // 'drop' *** built-in function in Phaser 3
        // gameObject: Card
        scene.input.on("drop", (pointer, gameObject, dropZone) => {
            let canGetPoints = false
            let cardType = ""
            // 是否符合屬性/卡牌類型? 不符合條件時卡牌須反轉, 並不能獲得靈感值
            switch (dropZone.name) {
                case "dropZone1": //天
                    if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerSkyElements.includes(gameObject.getData("element"))
                    ) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else {
                        canGetPoints = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.skyCardZoneName = gameObject.getData("id")
                    break
                case "dropZone2": //地
                    if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerGroundElements.includes(gameObject.getData("element"))
                    ) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else {
                        canGetPoints = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.groundCardZoneName = gameObject.getData("id")
                    break
                case "dropZone3": //人
                    if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerPersonElements.includes(gameObject.getData("element"))
                    ) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else {
                        canGetPoints = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.personCardZoneName = gameObject.getData("id")
                    break
                case "dropZone4": //日
                    if (gameObject.getData("id").includes("I")) {
                        canGetPoints = false
                        cardType = "cardBack"
                    } else if (gameObject.getData("id").includes("H")) {
                        canGetPoints = false
                        cardType = "HCard"
                    }
                    scene.GameHandler.sunCardZoneName = gameObject.getData("id")
                    break
            }

            // 卡牌移動到正確位置
            if (
                scene.GameHandler.isMyTurn &&
                scene.QuestionCardHandler.hasAnsweredQuestion &&
                scene.GameHandler.gameState === "Ready" &&
                dropZone.data.list.cards == 0
            ) {
                // 是否受到對方作者技能"限制出牌"影響?
                if (scene.GameHandler.opponentAbility === "限制出牌") {
                    const opponentTarget = scene.GameHandler.opponentTarget
                    const element = AbilityReader.getValueByTag(opponentTarget, "$element")
                    const rules = AbilityReader.getValueByTag(opponentTarget, "$rules")
                    console.log(
                        `%c[ability] element: ${element}, rules: ${rules}`,
                        "color: lightcoral; font-size: 14px; font-weight: bold;"
                    )
                    if (element !== null) {
                        const elementArray = element.split(",")
                        const isBeingDragged = elementArray.some((element) => {
                            if (gameObject.getData("element") === element) {
                                return true
                            }
                            return false
                        })
                        if (isBeingDragged) {
                            gameObject.x = gameObject.input.dragStartX
                            gameObject.y = gameObject.input.dragStartY
                            scene.Toast.showToast("你的靈感卡受到束縛,無法打出")
                            return
                        }
                    }
                    // 24256_W013 屈原: 雙方只可打出火/水/木各一張,不限天地人位置。但會跟 24256_W012 屈原 規則衝突(不能打木屬)?
                    // ** 暫時設定W013的效果會覆蓋W012的效果
                    if (rules === "W013") {
                        console.log("TODO")
                    }
                }
                // ---- 正常打出卡牌 ----
                // 鎖定卡牌位置
                gameObject.x = dropZone.x
                gameObject.y = dropZone.y
                // 卡牌大小
                gameObject.setScale(ScaleHandler.playerInSceneCard.scaleX, ScaleHandler.playerInSceneCard.scaleY)
                // 重設角度
                gameObject.setRotation(0)
                scene.input.setDraggable(gameObject, false)
                // activeState
                gameObject.setData("activeState", "inScene")
                // 音效
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                // 是否能獲得作者屬性加成?
                let authorBuffPts = 0
                let elementID = -1
                // 反轉卡牌判斷
                if (cardType === "cardBack") {
                    gameObject.getAt(0).setTexture("image_cardback")
                    gameObject.getAt(1)?.setVisible(false)
                }
                // 作者屬性加成  (無屬性不能獲得)
                if (gameObject.getData("id").includes("I")) {
                    const elementMap = {
                        火: 0,
                        水: 1,
                        木: 2,
                        金: 3,
                        土: 4,
                        無: 5,
                    }
                    elementID = elementMap[gameObject.getData("element")]

                    const isVoid = elementID === 5
                    authorBuffPts = isVoid ? 0 : scene.GameHandler.authorBuffs[elementID]
                }

                // 積分倍率計算，任何一張靈感卡蓋牌/成語卡蓋牌將無法獲得積分加倍。
                if (gameObject.getData("id").includes("I") && dropZone.name !== "dropZone4") {
                    // 同屬雙倍,同靈感三倍,同屬+同靈感值四倍。null表示無效積分計算。5表示無屬性。
                    // 同時存入卡牌的星數。
                    scene.socket.emit(
                        "serverSetCardType",
                        scene.socket.id,
                        canGetPoints ? elementID : null,
                        canGetPoints ? gameObject.getData("points") : null,
                        canGetPoints ? gameObject.getData("series") : null,
                        canGetPoints ? gameObject.getData("rarity") : null
                    )
                    // 作者屬性加成
                    scene.socket.emit("serverUpdateAuthorBuff", scene.socket.id, authorBuffPts)
                }
                // ** "日"(成語卡格)不能蓋牌，否則無法獲得積分加倍
                if (gameObject.getData("id").includes("H") && dropZone.name === "dropZone4") {
                    scene.socket.emit("serverSetHCardActiveState", scene.socket.id, true)
                }

                // 計算總得分。卡反轉時能不能獲得作者屬性
                const totalPointsToUpdate =
                    canGetPoints && cardType !== "cardBack" ? gameObject.getData("points") + authorBuffPts : 0
                // 通知server更新雙方卡牌位置。server再call SocketHandler的cardPlayed。對方能見到你打出手牌。
                scene.socket.emit(
                    "serverNotifyCardPlayed",
                    gameObject.getData("id"),
                    scene.socket.id,
                    dropZone.name,
                    scene.GameHandler.currentRoomID,
                    cardType
                )
                // 通知server再call SocketHandler的calculatePoints。
                scene.socket.emit(
                    "serverUpdatePoints",
                    totalPointsToUpdate,
                    scene.socket.id,
                    dropZone.name,
                    scene.GameHandler.currentRoomID
                )
                scene.socket.emit(
                    "serverUpdateCardInHand",
                    scene.socket.id,
                    gameObject.getData("id"),
                    scene.GameHandler.currentRoomID
                )

                // !! 技能:打牌加成
                if (scene.GameHandler.ability === "打牌加成") {
                    const target = scene.GameHandler.target
                    const targetRules = scene.GameHandler.targetRules
                    const score = Number(AbilityReader.getValueByTag(target, "$score"))
                    const series = AbilityReader.getValueByTag(targetRules, "$series")
                    console.log(
                        `%c[ability] score: ${score}, series: ${series}`,
                        "color: lightcoral; font-size: 14px; font-weight: bold;"
                    )

                    let isCardConditionMatch = false
                    if (series !== null && gameObject.getData("series") === series) {
                        isCardConditionMatch = true
                    }
                    if (score !== null && isCardConditionMatch && canGetPoints) {
                        scene.socket.emit("serverUpdateScores", scene.socket.id, score, scene.GameHandler.currentRoomID)
                    }
                }

                // !! 技能:結算加分 (先save extraScore落server, 對局結束後先一次過加算extraScore)
                if (scene.GameHandler.ability === "結算加分" && gameObject.getData("id").includes("I") && canGetPoints) {
                    let initialNumber = 0
                    const target = scene.GameHandler.target
                    const formula = AbilityReader.getValueByTag(target, "$formula")
                    const operator = AbilityReader.getValueByTag(target, "$operator")
                    const number = AbilityReader.getValueByTag(target, "$number")

                    console.log(
                        `%c[ability] formula: ${formula}, operator: ${operator}, nmuber: ${number}`,
                        "color: lightcoral; font-size: 14px; font-weight: bold;"
                    )

                    if (formula === "totalRarity") {
                        initialNumber = gameObject.getData("rarity")
                        console.log(`initialNumber: ${initialNumber}`)
                    }
                    // assert number !== null
                    if (operator === "/") {
                        initialNumber /= number
                        console.log(`initialNumber: ${initialNumber}`)
                    }
                    const extraScore = initialNumber
                    console.log(`extraScore: ${extraScore}`)
                    scene.socket.emit("serverUpdateExtraScores", scene.socket.id, extraScore)
                }

                scene.socket.emit("serverHideRollDiceText", scene.socket.id, scene.GameHandler.currentRoomID)
                dropZone.data.list.cards++
                // 同時檢查對局是否結束。如未結束，對方會得到一張題目卡。
                scene.socket.emit(
                    "serverEndRoundAfterPlayingCard",
                    scene.socket.id,
                    scene.GameHandler.opponentID,
                    scene.GameHandler.currentRoomID
                )
            } else {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY

                if (!scene.GameHandler.isMyTurn) {
                    scene.Toast.showToast("現在不是你的回合")
                } else if (!scene.QuestionCardHandler.hasAnsweredQuestion) {
                    scene.Toast.showToast("請先答題!")
                }
            }
        })
    }
}
