import PositionHandler from "./PositionHandler"

export default class Toast {
    constructor(scene) {
        this.isShowing = false

        this.showToast = (message) => {
            const toastText = scene.add
                .text(PositionHandler.toast.x, PositionHandler.toast.y, message, {
                    fontSize: "26px",
                    color: "#ffffff",
                    backgroundColor: "#ed7e68",
                    padding: { x: 20, y: 20 },
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100)
                .setAlpha(0)

            scene.tweens.add({
                targets: toastText,
                alpha: 1,
                duration: 100,
                ease: "Linear",
                onComplete: () => {
                    setTimeout(() => {
                        // Fade out
                        scene.tweens.add({
                            targets: toastText,
                            alpha: 0,
                            duration: 100,
                            ease: "Linear",
                            onComplete: () => {
                                toastText.destroy()
                            },
                        })
                    }, 2000) // Delay before fade-out starts
                },
            })
        }
    }
}
