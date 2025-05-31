import Color from "../helpers/Color"
import PositionHandler from "../helpers/PositionHandler"
import ApiDomain from "../mixins/ApiDomain"

export default class ScoreBoardHandler {
    constructor(scene) {
        this.top10Players = []
        this.yourScore = []
        this.initUI = () => {
            this.fetchPlayerData()
        }

        this.fetchPlayerData = () => {
            fetch(`${ApiDomain.name}/api/get-sheet-data?range=帳號!B2:D200`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const playerInfo = data
                    // Find your score before sorting, or the result will be incorrect
                    const yourInfo = playerInfo[Number(scene.registry.get("uniqueId"))]
                    this.yourScore = yourInfo
                    // Sort players by score in descending order
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
            const numOfTopPlayers = 10
            scene.scoreBoardLeft = scene.add.text(PositionHandler.scoreBoardLeft.x, PositionHandler.scoreBoardLeft.y, "玩家", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })

            for (let i = 1; i <= numOfTopPlayers; i++) {
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
            const yourScoreBoardLeft = scene.add.text(
                PositionHandler.scoreBoardLeft.x,
                PositionHandler.scoreBoardLeft.y + (numOfTopPlayers + 1) * 50,
                this.yourScore[0],
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#ffd700",
                }
            )
            scene.scoreBoardRight = scene.add.text(PositionHandler.scoreBoardRight.x, PositionHandler.scoreBoardRight.y, "分數", {
                fontSize: 20,
                fontFamily: "Trebuchet MS",
                color: "#00ffff",
            })
            for (let i = 1; i <= numOfTopPlayers; i++) {
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
            const yourScoreBoardRight = scene.add.text(
                PositionHandler.scoreBoardRight.x,
                PositionHandler.scoreBoardRight.y + (numOfTopPlayers + 1) * 50,
                this.yourScore[2] || "0",
                {
                    fontSize: 20,
                    fontFamily: "Trebuchet MS",
                    color: "#ffd700",
                }
            )
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
