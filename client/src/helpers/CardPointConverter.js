export default class CardPointConverter {
    static getPoints = (gameObject) => {
        const gameObjectData = gameObject.data.list
        if (!gameObjectData?.id?.includes("I")) {
            console.error(
                "%c[CardPointConverter Error] It shouldn't happen....",
                "color: red; font-size: 18px; font-weight: bold;"
            )
            return
        }
        if (gameObjectData.isForcedSetPoints) {
            return Number(gameObjectData.modifiedPoints)
        } else {
            return Number(gameObjectData.points) + Number(gameObjectData.extraPoints)
        }
    }
}
