export default class ElementChecker {
    static getCurrentCardElement = (gameObject) => {
        const gameObjectData = gameObject.data.list
        if (!gameObjectData?.id?.includes("I")) {
            console.error(
                "%c[ElementChecker getCurrentCardElement Error] It shouldn't happen....",
                "color: red; font-size: 18px; font-weight: bold;"
            )
            return
        }
        return gameObjectData.modifiedElement ? gameObjectData.modifiedElement : gameObjectData.element
    }
    static isVoid = (gameObject) => {
        const gameObjectData = gameObject?.data?.list
        if (!gameObjectData?.id?.includes("I")) {
            console.error(
                "%c[ElementChecker isVoid Error] It shouldn't happen....",
                "color: red; font-size: 18px; font-weight: bold;"
            )
            return null
        }

        const currentElement = gameObjectData.modifiedElement ?? gameObjectData.element
        return currentElement === "無"
    }
}
