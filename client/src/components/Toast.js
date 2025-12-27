import PositionHandler from "../helpers/PositionHandler"
export default class Toast {
    constructor(scene) {
        this.scene = scene
        this.toasts = []
        this.normalToastCurrentCount = 0
        this.activeSkillToast = null
    }

    createToastText({ x, y, message, backgroundColor, alpha = 0.7, padding, widthMutiplier = 4, heightMutiplier = 0.6 }) {
        const graphics = this.scene.add.graphics()

        const text = this.scene.add
            .text(x, y, message, {
                fontSize: "26px",
                fontFamily: "Trebuchet MS",
                color: "#ffffff",
                padding,
                align: "center",
            })
            .setOrigin(0.5)

        const { width, height } = text
        const bgWidth = width + padding.x * 2
        const bgHeight = height + padding.y * 2
        const increasedWidth = bgWidth * widthMutiplier
        const reducedHeight = bgHeight * heightMutiplier

        // Background
        graphics
            .fillStyle(backgroundColor, alpha)
            .fillRoundedRect(x - increasedWidth / 2, y - reducedHeight / 2, increasedWidth, reducedHeight, 8)

        // Group everything
        const container = this.scene.add
            .container(0, 0, [graphics, text])
            .setDepth(100)
            .setAlpha(0)
            .setData({ id: "notInteractable" })

        return container
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
            backgroundColor: 0x302e2e,
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
            backgroundColor: 0x302e2e,
            padding: { x: 20, y: 20 },
        })
        this.scene.tweens.add({
            targets: toastText,
            alpha: 1,
            duration: 100,
            ease: "Linear",
        })
    }

    showActiveSkillTipsToast = (message) => {
        this.activeSkillToast = this.createToastText({
            x: PositionHandler.activeSkillToast.x,
            y: PositionHandler.activeSkillToast.y,
            message,
            backgroundColor: 0x302e2e,
            alpha: 1,
            padding: { x: 20, y: 20 },
            widthMutiplier: 1,
        })
        this.scene.tweens.add({
            targets: this.activeSkillToast,
            alpha: 1,
            duration: 100,
            ease: "Linear",
        })
    }

    hideActiveSkillTipsToast = () => {
        if (!this.activeSkillToast) return
        this.activeSkillToast.destroy()
    }

    showTopToast = (message) => {
        const toastText = this.createToastText({
            x: PositionHandler.topToast.x,
            y: PositionHandler.topToast.y,
            message,
            backgroundColor: 0x302e2e,
            padding: { x: 20, y: 20 },
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
