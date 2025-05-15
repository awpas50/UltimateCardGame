import PositionHandler from "../helpers/PositionHandler"
export default class Toast {
    constructor(scene) {
        this.scene = scene
        this.toasts = []
        this.normalToastCurrentCount = 0
    }

    createToastText({ x, y, message, backgroundColor, padding }) {
        return this.scene.add
            .text(x, y, message, {
                fontSize: "26px",
                fontFamily: "Trebuchet MS",
                color: "#ffffff",
                backgroundColor,
                padding,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setAlpha(0)
    }

    showToast = (message) => {
        // Move existing toasts upward by 75px, if a new toast is created.
        this.toasts.forEach((toast) =>
            this.scene.tweens.add({
                targets: toast,
                y: toast.y - 75,
                duration: 100,
                ease: "Linear",
            })
        )

        const toastText = this.createToastText({
            x: PositionHandler.toast.x,
            y: PositionHandler.toast.y,
            message,
            backgroundColor: "#ed7e68",
            padding: { x: 20, y: 20 },
        })

        this.normalToastCurrentCount++
        this.scene.tweens.add({
            targets: toastText,
            y: toastText.y - 50,
            alpha: 1,
            duration: 100,
            ease: "Linear",
            onComplete: () => {
                setTimeout(() => {
                    this.scene.tweens.add({
                        targets: toastText,
                        alpha: 0,
                        duration: 100,
                        ease: "Linear",
                        onComplete: () => {
                            toastText.destroy()
                            this.normalToastCurrentCount--
                            this.toasts = this.toasts.filter((t) => t !== toastText)
                        },
                    })
                }, 2000)
            },
        })
        this.toasts.push(toastText)
    }

    showPermanentToast = (message) => {
        const toastText = this.createToastText({
            x: PositionHandler.toast.x,
            y: PositionHandler.toast.y,
            message,
            backgroundColor: "#ed7e68",
            padding: { x: 20, y: 20 },
        })
        this.scene.tweens.add({
            targets: toastText,
            alpha: 1,
            duration: 100,
            ease: "Linear",
        })
    }

    showTopToast = (message) => {
        const toastText = this.createToastText({
            x: PositionHandler.topToast.x,
            y: PositionHandler.topToast.y,
            message,
            backgroundColor: "#6e6a69",
            padding: { x: 600, y: 20 },
        })
        this.scene.tweens.add({
            targets: toastText,
            y: toastText.y + 35,
            alpha: 1,
            duration: 100,
            ease: "Linear",
            onComplete: () => {
                setTimeout(() => {
                    this.scene.tweens.add({
                        targets: toastText,
                        y: toastText.y - 35,
                        alpha: 0,
                        duration: 100,
                        ease: "Linear",
                        onComplete: () => toastText.destroy(),
                    })
                }, 3000)
            },
        })
    }
}
