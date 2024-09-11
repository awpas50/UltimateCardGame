export default class CardStorage {
    constructor(scene) {
        // to destroy, call let imageToDestroy = this.ICardStorage.find(image => image.getData('id') === id)
        // than call imageToDestroy.destroy()
        // remember to delete image from the array by calling
        // this.ICardStorage = this.ICardStorage.filter(image => image.getData('id') !== id

        // If items are removed in these arrays, the item in the scene will be removed as well.
        // type: Phaser3.GameObject.Image
        this.inHandStorage = []
        this.inSceneStorage = []
        this.wCardStorage = []
        this.opponentCardBackStorage = []

        this.changeCardToAnotherStorage = (cardId, fromArray, toArray) => {
            console.log("cardId: " + cardId)
            console.log(fromArray[0].data.list.id)
            console.log(fromArray[0].getData("id"))
            const item = fromArray.find((gameObject) => gameObject.data.list.id === cardId)
            console.log(item)
            // const index = fromArray.indexOf(item)
            // if (index !== -1) {
            //     const [removedItem] = fromArray.splice(index, 1)
            //     toArray.push(removedItem)
            // }
        }

        this.deleteCard = (cardId, fromArray) => {}
    }
}
