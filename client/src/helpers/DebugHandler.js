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
        // disabled in production
        // scene.input.keyboard.on("keydown-NUMPAD_ADD", () => {
        //     scene.socket.emit("serverDebugUpdateScores", scene.socket.id, 1, (response) => {
        //         console.log("[Debug] 強制加分+1", response)
        //     })
        // })
    }
}
