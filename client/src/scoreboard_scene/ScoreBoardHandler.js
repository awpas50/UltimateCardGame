import Color from "../helpers/Color"
import PositionHandler from "../helpers/PositionHandler"

export default class ScoreBoardHandler {
    constructor(scene) {
        this.top10Players = {}
        this.initUI = () => {
            this.fetchPlayerData()
        }

        this.fetchPlayerData = () => {
            const domain =
                window.location.hostname === "ultimatecardgame.onrender.com"
                    ? "ultimatecardgame.onrender.com"
                    : "http://" + window.location.hostname + ":3000"
            fetch(`${domain}/api/get-sheet-data?range=帳號!B2:D200`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const playerInfo = data
                    playerInfo.sort((a, b) => parseInt(b[2] || 0) - parseInt(a[2] || 0))
                    this.top10Players = playerInfo.slice(0, 10)
                })
                .then(() => {
                    this.generateScoreBoard()
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
        }

        this.generateScoreBoard = () => {
            scene.scoreBoardLeft = scene.add.text(PositionHandler.scoreBoardLeft.x, PositionHandler.scoreBoardLeft.y, "玩家", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
            })

            for (let i = 1; i <= 10; i++) {
                const scoreBoardLeft = scene.add.text(
                    PositionHandler.scoreBoardLeft.x,
                    PositionHandler.scoreBoardLeft.y + i * 50,
                    this.top10Players[i - 1][0],
                    {
                        fontSize: 20,
                        fontFamily: "Trebuchet MS",
                    }
                )
            }
            scene.scoreBoardRight = scene.add.text(PositionHandler.scoreBoardRight.x, PositionHandler.scoreBoardRight.y, "分數", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
            })
            for (let i = 1; i <= 10; i++) {
                const scoreBoardRight = scene.add.text(
                    PositionHandler.scoreBoardRight.x,
                    PositionHandler.scoreBoardRight.y + i * 50,
                    this.top10Players[i - 1][2] || "0",
                    {
                        fontSize: 20,
                        fontFamily: "Trebuchet MS",
                    }
                )
            }
            // Back
            scene.scoreBoardQuitText = scene.add.text(
                PositionHandler.scoreBoardQuitText.x,
                PositionHandler.scoreBoardQuitText.y,
                "返回",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#00ffff",
                }
            )
            scene.scoreBoardQuitText.setInteractive()
            scene.scoreBoardQuitText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.scene.wake("Game")
                scene.scene.get("Game").sys.setVisible(true)
                scene.scene.get("Game").sys.setActive(true)
                scene.scene.stop("ScoreBoard")
            })

            scene.scoreBoardQuitText.on("pointerover", () => {
                scene.scoreBoardQuitText.setColor("#fff5fa")
            })
            scene.scoreBoardQuitText.on("pointerout", () => {
                scene.scoreBoardQuitText.setColor("#00ffff")
            })
        }
    }
}
