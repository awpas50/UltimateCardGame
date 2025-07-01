export default class AnimationHandler {
    static flipCardMultipleTimes(card, textures = ["image_cardback"], times = 3, scene, onComplete) {
        let currentFlip = 0

        const doFlip = () => {
            if (currentFlip >= times) {
                if (onComplete && typeof onComplete === "function") {
                    onComplete()
                }
                return
            }

            scene.tweens.add({
                targets: card,
                scaleX: 0,
                duration: 100,
                ease: "Cubic.easeIn",
                onComplete: () => {
                    // card.getAt(0)?.setTexture(textures[currentFlip % textures.length])
                    scene.tweens.add({
                        targets: card,
                        scaleX: 0.26,
                        duration: 50,
                        ease: "Cubic.easeOut",
                        onComplete: () => {
                            currentFlip++
                            doFlip()
                        },
                    })
                },
            })
        }
        doFlip()
    }
}
