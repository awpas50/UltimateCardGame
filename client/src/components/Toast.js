import PositionHandler from "../helpers/PositionHandler"

export default class Toast {
    constructor(scene) {
        this.isShowing = false
        this.normalToastCurrentCount = 0
        this.toasts = []

        this.showToast = (message) => {
            // Move existing toasts upward by 75px, if a new toast is created.
            this.toasts.forEach((toast) => {
                scene.tweens.add({
                    targets: toast,
                    y: toast.y - 75,
                    duration: 100,
                    ease: "Linear",
                })
            })
            const toastText = scene.add
                .text(PositionHandler.toast.x, PositionHandler.toast.y, message, {
                    fontSize: "26px",
                    fontFamily: "Trebuchet MS",
                    color: "#ffffff",
                    backgroundColor: "#ed7e68",
                    padding: { x: 20, y: 20 },
                    align: "center",
                })
                .setOrigin(0.5)
                .setDepth(100)
                .setAlpha(0)

            this.normalToastCurrentCount++

            scene.tweens.add({
                targets: toastText,
                y: toastText.y - 50,
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
                                this.normalToastCurrentCount--
                                this.toasts = this.toasts.filter((toast) => toast !== toastText)
                            },
                        })
                    }, 2000)
                },
            })
            this.toasts.push(toastText)
        }

        this.showPermanentToast = (message) => {
            const toastText = scene.add
                .text(PositionHandler.toast.x, PositionHandler.toast.y, message, {
                    fontSize: "26px",
                    fontFamily: "Trebuchet MS",
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
            })
        }
    }
}
