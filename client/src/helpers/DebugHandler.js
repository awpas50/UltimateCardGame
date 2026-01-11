import ApiDomain from "../mixins/ApiDomain"
export default class DebugHandler {
    constructor(scene) {
        // Get the x and y coordinates of the mouse pointer
        scene.input.on("pointerdown", (pointer) => {
            const x = pointer.x
            const y = pointer.y
            console.log(`Clicked at X: ${Math.round(x)}, Y: ${Math.round(y)}`)
        })
        scene.input.keyboard.on("keydown-ONE", () => {
            scene.socket.emit("serverGetPlayerStats", scene.socket.id, "all", (response) => {
                console.log("[Debug] 所有資料", response)
            })
        })
        scene.input.keyboard.on("keydown-TWO", () => {
            scene.socket.emit("serverGetPlayerStats", scene.socket.id, "cards-in-hand", (response) => {
                console.log("[Debug] 手牌", response)
            })
        })
        scene.input.keyboard.on("keydown-THREE", () => {
            scene.socket.emit("serverGetPlayerStats", scene.socket.id, "w-cards-in-hand", (response) => {
                console.log("[Debug] 當前作者卡", response)
            })
        })
        scene.input.keyboard.on("keydown-FOUR", () => {
            scene.socket.emit("serverGetPlayerStats", scene.socket.id, "scores", (response) => {
                console.log("[Debug] 分數相關", response)
            })
        })
        scene.input.keyboard.on("keydown-FIVE", () => {
            scene.socket.emit("serverGetPlayerStats", scene.socket.id, "ability-multiplier", (response) => {
                console.log("[Debug] 技能類型：倍率加成", response)
            })
        })
        scene.input.keyboard.on("keydown-SIX", () => {
            console.log("[Debug] 你的回合? ", scene.GameHandler.isMyTurn)
        })
        scene.input.keyboard.on("keydown-SEVEN", () => {
            console.log({
                playerSkyElements: scene.GameHandler.playerSkyElements,
                playerGroundElements: scene.GameHandler.playerGroundElements,
                playerPersonElements: scene.GameHandler.playerPersonElements,

                opponentSkyElements: scene.GameHandler.opponentSkyElements,
                opponentGroundElements: scene.GameHandler.opponentGroundElements,
                opponentPersonElements: scene.GameHandler.opponentPersonElements,

                playerInSceneElement: scene.GameHandler.playerInSceneElement,
                playerInSceneElementCalculator: scene.GameHandler.playerInSceneElementCalculator,
                playerInSceneIPointCalculator: scene.GameHandler.playerInSceneIPointCalculator,
                playerInSceneSeriesCalculator: scene.GameHandler.playerInSceneSeriesCalculator,
                playerInSceneRarityCalculator: scene.GameHandler.playerInSceneRarityCalculator,

                opponentInSceneElement: scene.GameHandler.opponentInSceneElement,
                opponentInSceneElementCalculator: scene.GameHandler.opponentInSceneElementCalculator,
                opponentInSceneIPointCalculator: scene.GameHandler.opponentInSceneIPointCalculator,
                opponentInSceneSeriesCalculator: scene.GameHandler.opponentInSceneSeriesCalculator,
                opponentInSceneRarityCalculator: scene.GameHandler.opponentInSceneRarityCalculator,
            })
        })
        scene.input.keyboard.on("keydown-EIGHT", () => {
            console.log("[Debug] Excel強制計分")
            const offset = 2
            const uniqueId = scene.registry.get("uniqueId") || "0"
            fetch(`${ApiDomain.name}/api/update-sheet-data/raw?range=帳號!D${Number(uniqueId) + offset}&value=1`, {
                method: "POST",
            })
        })
        // disabled in production
        // scene.input.keyboard.on("keydown-NUMPAD_ADD", () => {
        //     scene.socket.emit("serverDebugUpdateScores", scene.socket.id, 1, (response) => {
        //         console.log("[Debug] 強制加分+1", response)
        //     })
        // })
    }
}
