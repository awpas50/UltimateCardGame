import PositionHandler from "./PositionHandler.js"
import ScaleHandler from "./ScaleHandler.js"
import { QCard_Data } from "../scenes/game.js"

export default class QuestionCardHandler {
    constructor(scene) {
        this.interval = null
        this.correctAnswer = ""
        this.hasAnsweredQuestion = true

        this.initQuestionCard = () => {
            this.hasAnsweredQuestion = false
            const numberOfQCards = 48
            const RNG = Math.floor(Math.random() * numberOfQCards) + 1
            const qCardId = RNG >= 1 && RNG <= 9 ? "0" + RNG : RNG

            this.correctAnswer = QCard_Data[`Q0${qCardId}`].answer

            scene.questionCardPreview = scene.add
                .image(PositionHandler.cardPreviewEnd.x, PositionHandler.cardPreviewEnd.y, "Q0" + qCardId)
                .setScale(ScaleHandler.cardPreview.scale)
            let tween = scene.tweens.add({
                targets: scene.questionCardPreview,
                x: 465,
                duration: 100,
                ease: "Linear",
                yoyo: false, // Don't yoyo (return to start position) after tween ends
                repeat: 0,
            })
            tween.play()

            this.startAnswerTimer()
            this.buildAnswerTextAndSetCorrectAnswer()
        }

        this.startAnswerTimer = () => {
            let timer = 20
            scene.questionCardTimerText = scene.add
                .text(PositionHandler.questionCardTimer.x, PositionHandler.questionCardTimer.y, "剩餘時間: ")
                .setFontSize(20)
                .setFontFamily("Trebuchet MS")
            this.interval = setInterval(() => {
                timer--
                scene.questionCardTimerText.text = "剩餘時間: " + timer
                if (timer < 0) {
                    clearInterval(this.interval)
                    scene.socket.emit("serverUpdateScores", scene.socket.id, -1, scene.GameHandler.currentRoomID)
                    scene.Toast.showToast("沒有回答！扣1分")
                    console.log("%c[question] Not answer -1", "color: slateblue; font-size: 14px; font-weight: bold;")
                    this.deleteAnswerTextAndResetQuestion()
                    scene.questionCardPreview.destroy()
                }
            }, 1000)
        }

        this.stopAnswerTimer = () => {
            clearInterval(this.interval)
            this.interval = null
        }

        this.buildAnswerTextAndSetCorrectAnswer = () => {
            const answerPositionMap = {
                A: PositionHandler.answerA,
                B: PositionHandler.answerB,
                C: PositionHandler.answerC,
                D: PositionHandler.answerD,
            }

            const createAnswerText = (key, position, backgroundColor) => {
                scene[`answer${key}Text`] = scene.add
                    .text(position.x, position.y, key, { backgroundColor: backgroundColor, padding: { x: 8, y: 8 } })
                    .setFontSize(24)
                    .setFontFamily("Trebuchet MS")

                scene[`answer${key}Text`].setInteractive({ useHandCursor: true })
                scene[`answer${key}Text`].on("pointerdown", () => {
                    this.stopAnswerTimer()
                    console.log("%c[question] selected:" + key, "color: slateblue; font-size: 14px; font-weight: bold;")
                    if (this.correctAnswer === key) {
                        console.log("%c[question] Correct +1", "color: slateblue; font-size: 14px; font-weight: bold;")
                        scene.Toast.showToast("答對！加1分")
                        scene.socket.emit("serverUpdateScores", scene.socket.id, 1, scene.GameHandler.currentRoomID)
                    } else {
                        scene.Toast.showToast("答錯！扣1分")
                        console.log("%c[question] Wrong -1", "color: slateblue; font-size: 14px; font-weight: bold;")
                        scene.socket.emit("serverUpdateScores", scene.socket.id, -1, scene.GameHandler.currentRoomID)
                    }
                    this.deleteAnswerTextAndResetQuestion()
                })
            }

            createAnswerText("A", answerPositionMap["A"], "#c96d63") // red
            createAnswerText("B", answerPositionMap["B"], "#63a4c9") // blue
            createAnswerText("C", answerPositionMap["C"], "#8063c9") // purple
            createAnswerText("D", answerPositionMap["D"], "#d69429") // orange
        }

        this.deleteAnswerTextAndResetQuestion = () => {
            scene.answerAText.destroy()
            scene.answerBText.destroy()
            scene.answerCText.destroy()
            scene.answerDText.destroy()
            scene.questionCardTimerText.destroy()
            scene.questionCardPreview.destroy()
            this.correctAnswer = ""
            this.hasAnsweredQuestion = true
        }
    }
}
