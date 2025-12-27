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
    static setAuthorBuffPointForICard = (gameObject, authorBuffsArray) => {
        const gameObjectData = gameObject.data.list
        const elementMap = {
            火: 0,
            水: 1,
            木: 2,
            金: 3,
            土: 4,
            無: 5,
        }

        const currentElement = gameObjectData.modifiedElement ? gameObjectData.modifiedElement : gameObjectData.element
        const elementID = elementMap[currentElement]

        const isVoid = elementID === 5
        return isVoid ? 0 : authorBuffsArray[elementID]
    }
}
