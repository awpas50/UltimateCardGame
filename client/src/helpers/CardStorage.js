export default class CardStorage {
    constructor(scene) {
        // to destroy, call let imageToDestroy = this.ICardStorage.find(image => image.getData('id') === id)
        // than call imageToDestroy.destroy()
        // remember to delete image from the array by calling
        // this.ICardStorage = this.ICardStorage.filter(image => image.getData('id') !== id

        // If items are removed in these arrays, the item in the scene will be removed as well.
        // type: Phaser3.GameObject.Image
        this.ICardStorage = []
        this.HCardStorage = []
        this.WCardStorage = []
        this.InSceneStorage = []
        this.opponentCardBackStorage = []
    }
}
