import CardStorage from "../helpers/CardStorage"
import DeckHandler from "../helpers/DeckHandler"
import GameHandler from "../helpers/GameHandler"
import InteractiveHandler from "../helpers/InteractiveHandler"
import QuestionCardHandler from "../helpers/QuestionCardHandler"
import SocketHandler from "../helpers/SocketHandler"
import UIHandler from "../helpers/UIHandler"
import ZoneHandler from "../helpers/ZoneHandler"
import Toast from "../components/Toast"

// 靈感卡：編號/名稱/星數/屬性/系列/標籤/靈感值
export const ICard_Data_24256 = {
    "24256_I019": { ID: "24256_I019", name: "雲母", rarity: 3, element: "金", series: "中秋", tag: "", points: 70 },
    "24256_I021": { ID: "24256_I021", name: "靈藥", rarity: 2, element: "火", series: "中秋", tag: "", points: 20 },
    "24256_I028": { ID: "24256_I028", name: "蓼莪", rarity: 2, element: "木", series: "詩經", tag: "", points: 60 },
    "24256_I029": { ID: "24256_I029", name: "缾罍", rarity: 2, element: "金", series: "詩經", tag: "酒", points: 0 },
    "24256_I035": { ID: "24256_I035", name: "關睢", rarity: 5, element: "木", series: "詩經", tag: "", points: 100 },

    "24256_I037": { ID: "24256_I037", name: "荇菜", rarity: 4, element: "水", series: "詩經", tag: "", points: 20 },
    "24256_I040": { ID: "24256_I040", name: "相鼠", rarity: 2, element: "土", series: "詩經", tag: "", points: 50 },
    "24256_I049": { ID: "24256_I049", name: "漁父", rarity: 4, element: "水", series: "楚辭", tag: "", points: 40 },
    "24256_I052": { ID: "24256_I052", name: "山鬼", rarity: 5, element: "木", series: "楚辭", tag: "神", points: 90 },
    "24256_I059": { ID: "24256_I059", name: "冠者", rarity: 3, element: "土", series: "孔子", tag: "", points: 20 },

    "24256_I060": { ID: "24256_I060", name: "社稷", rarity: 5, element: "土", series: "孔子", tag: "神", points: 100 },
    "24256_I069": { ID: "24256_I069", name: "勿視", rarity: 3, element: "土", series: "孔子", tag: "", points: 90 },
    "24256_I071": { ID: "24256_I071", name: "數罟", rarity: 4, element: "土", series: "孟子", tag: "", points: 0 },
    "24256_I074": { ID: "24256_I074", name: "雞豚", rarity: 2, element: "土", series: "孟子", tag: "", points: 80 },
    "24256_I077": { ID: "24256_I077", name: "四善", rarity: 2, element: "火", series: "孟子", tag: "", points: 40 },

    "24256_I078": { ID: "24256_I078", name: "揠苗", rarity: 2, element: "木", series: "孟子", tag: "", points: 30 },
    "24256_I080": { ID: "24256_I080", name: "觳觫", rarity: 3, element: "水", series: "孟子", tag: "", points: 30 },
    "24256_I083": { ID: "24256_I083", name: "不能", rarity: 2, element: "水", series: "孟子", tag: "", points: 30 },
    "24256_I085": { ID: "24256_I085", name: "知魚", rarity: 2, element: "水", series: "莊子", tag: "", points: 50 },
    "24256_I086": { ID: "24256_I086", name: "解牛", rarity: 3, element: "土", series: "莊子", tag: "", points: 30 },

    "24256_I087": { ID: "24256_I087", name: "庖丁", rarity: 5, element: "火", series: "莊子", tag: "", points: 90 },
    "24256_I097": { ID: "24256_I097", name: "猿石", rarity: 3, element: "木", series: "澳門", tag: "", points: 60 },
    "24256_I100": { ID: "24256_I100", name: "哪吒", rarity: 5, element: "火", series: "澳門", tag: "神", points: 100 },
    "24256_I102": { ID: "24256_I102", name: "乞婦", rarity: 4, element: "火", series: "澳門", tag: "", points: 10 },
    "24256_I103": { ID: "24256_I103", name: "彈珠", rarity: 3, element: "金", series: "澳門", tag: "", points: 20 },

    "24256_I104": { ID: "24256_I104", name: "醉龍", rarity: 2, element: "火", series: "澳門", tag: "", points: 90 },
    "24256_I120": { ID: "24256_I120", name: "卑鄙", rarity: 2, element: "土", series: "三國", tag: "", points: 0 },
    "24256_I123": { ID: "24256_I123", name: "爆竹", rarity: 3, element: "火", series: "新年", tag: "", points: 70 },
    "24256_I124": { ID: "24256_I124", name: "桃符", rarity: 4, element: "金", series: "新年", tag: "", points: 50 },
    "24256_I125": { ID: "24256_I125", name: "屠蘇", rarity: 2, element: "土", series: "新年", tag: "", points: 70 },

    "24256_I128": { ID: "24256_I128", name: "祝融", rarity: 5, element: "火", series: "新年", tag: "神", points: 100 },
    "24256_I130": { ID: "24256_I130", name: "投壺", rarity: 5, element: "土", series: "新年", tag: "", points: 50 },
    "24256_I140": { ID: "24256_I140", name: "市義", rarity: 5, element: "金", series: "戰國", tag: "", points: 70 },
    "24256_I143": { ID: "24256_I143", name: "不說", rarity: 2, element: "水", series: "戰國", tag: "", points: 30 },
    "24256_I144": { ID: "24256_I144", name: "門客", rarity: 2, element: "火", series: "戰國", tag: "", points: 0 },

    "24256_I145": { ID: "24256_I145", name: "劍舞", rarity: 3, element: "火", series: "史記", tag: "", points: 40 },
    "24256_I146": { ID: "24256_I146", name: "翼蔽", rarity: 2, element: "火", series: "史記", tag: "", points: 30 },
    "24256_I151": { ID: "24256_I151", name: "刀俎", rarity: 4, element: "土", series: "史記", tag: "", points: 80 },
    "24256_I153": { ID: "24256_I153", name: "杯杓", rarity: 3, element: "金", series: "史記", tag: "酒", points: 30 },
    "24256_I155": { ID: "24256_I155", name: "案圖", rarity: 4, element: "土", series: "史記", tag: "", points: 40 },

    "24256_I157": { ID: "24256_I157", name: "奏瑟", rarity: 5, element: "金", series: "史記", tag: "", points: 50 },
}

export const HCard_Data_24256 = {
    "24256_H019": { ID: "24256_H019" },
    "24256_H036": { ID: "24256_H036" },
    "24256_H037": { ID: "24256_H037" },
    "24256_H042": { ID: "24256_H042" },
    "24256_H043": { ID: "24256_H043" },
    "24256_H045": { ID: "24256_H045" },
    "24256_H053": { ID: "24256_H053" },
    "24256_H063": { ID: "24256_H063" },
    "24256_H066": { ID: "24256_H066" },
    "24256_H068": { ID: "24256_H068" },
    "24256_H073": { ID: "24256_H073" },
    "24256_H075": { ID: "24256_H075" },
    "24256_H090": { ID: "24256_H090" },
    "24256_H098": { ID: "24256_H098" },
}

export const QCard_Data = {
    Q001: { ID: "Q001", name: "完璧歸趙", answer: "B" },
    Q002: { ID: "Q002", name: "集腋成裘", answer: "A" },
    Q003: { ID: "Q003", name: "桀驁不馴", answer: "D" },
    Q004: { ID: "Q004", name: "剛愎自用", answer: "C" },
    Q005: { ID: "Q005", name: "和藹可親", answer: "B" },
    Q006: { ID: "Q006", name: "飛揚跋扈", answer: "D" },
    Q007: { ID: "Q007", name: "明辨是非", answer: "C" },
    Q008: { ID: "Q008", name: "敝帚自珍", answer: "A" },
    Q009: { ID: "Q009", name: "按部就班", answer: "A" },
    Q010: { ID: "Q010", name: "為虎作倀", answer: "C" },
    Q011: { ID: "Q011", name: "相輔相成", answer: "D" },
    Q012: { ID: "Q012", name: "一張一弛", answer: "C" },
    Q013: { ID: "Q013", name: "相形見絀", answer: "B" },
    Q014: { ID: "Q014", name: "出類拔萃", answer: "D" },
    Q015: { ID: "Q015", name: "川流不息", answer: "A" },
    Q016: { ID: "Q016", name: "鞠躬盡瘁", answer: "B" },
    Q017: { ID: "Q017", name: "理屈詞窮", answer: "A" },
    Q018: { ID: "Q018", name: "披星戴月", answer: "D" },
    Q019: { ID: "Q019", name: "虎視眈眈", answer: "D" },
    Q020: { ID: "Q020", name: "中流砥柱", answer: "C" },
    Q021: { ID: "Q021", name: "雕蟲小技", answer: "B" },
    Q022: { ID: "Q022", name: "破釜沉舟", answer: "A" },
    Q023: { ID: "Q023", name: "入不敷出", answer: "D" },
    Q024: { ID: "Q024", name: "覆水難收", answer: "A" },
    Q025: { ID: "Q025", name: "言簡意賅", answer: "D" },
    Q026: { ID: "Q026", name: "英雄氣概", answer: "B" },
    Q027: { ID: "Q027", name: "立竿見影", answer: "A" },
    Q028: { ID: "Q028", name: "一鼓作氣", answer: "A" },
    Q029: { ID: "Q029", name: "卑躬屈膝", answer: "B" },
    Q030: { ID: "Q030", name: "性格粗獷", answer: "C" },
    Q031: { ID: "Q031", name: "食不果腹", answer: "D" },
    Q032: { ID: "Q032", name: "煥然一新", answer: "A" },
    Q033: { ID: "Q033", name: "慘絕人寰", answer: "D" },
    Q034: { ID: "Q034", name: "病入膏肓", answer: "B" },
    Q035: { ID: "Q035", name: "拾人牙慧", answer: "D" },
    Q036: { ID: "Q036", name: "精神渙散", answer: "C" },
    Q037: { ID: "Q037", name: "寒暄客套", answer: "D" },
    Q038: { ID: "Q038", name: "演繹歸納", answer: "A" },
    Q039: { ID: "Q039", name: "斷壁頹垣", answer: "A" },
    Q040: { ID: "Q040", name: "寧靜致遠", answer: "B" },
    Q041: { ID: "Q041", name: "徇私舞弊", answer: "C" },
    Q042: { ID: "Q042", name: "綠樹成蔭", answer: "C" },
    Q043: { ID: "Q043", name: "口乾舌燥", answer: "B" },
    Q044: { ID: "Q044", name: "膾炙人口", answer: "B" },
    Q045: { ID: "Q045", name: "照本宣科", answer: "D" },
    Q046: { ID: "Q046", name: "緣木求魚", answer: "A" },
    Q047: { ID: "Q047", name: "敲詐勒索", answer: "C" },
    Q048: { ID: "Q048", name: "梳妝打扮", answer: "B" },
}

// 編號/名稱/等級/天/地/人屬性
// 無屬性填 ["火", "水", "木", "金", "土"]

// 火/水/木/金/土屬性加成
// 例子: [0, 50, 0, -20, 0] 指水+50, 金-20.
export const WCard_Data_24256 = {
    "24256_W001": {
        ID: "24256_W001",
        name: "李煜",
        rarity: 2,
        sky: ["金", "水"],
        ground: ["土", "水", "木"],
        person: ["火", "水", "金"],
        authorBuffs: [0, 50, 0, -20, 0],
        ability: "搜尋",
        target: "$element=水$count=1",
    },

    "24256_W002": {
        ID: "24256_W002",
        name: "孟子",
        rarity: 2,
        sky: ["土", "火"],
        ground: ["水", "火", "土"],
        person: ["木", "火", "金"],
        authorBuffs: [40, 0, 0, 0, 10],
        ability: "打牌加成",
        target: "$score=2",
        targetRules: "$series=孟子",
    },

    "24256_W004": {
        ID: "24256_W004",
        name: "莊子",
        rarity: 2,
        sky: ["土", "金"],
        ground: ["木", "土"],
        person: ["火", "土"],
        authorBuffs: [20, 0, 0, 0, 30],
        ability: "倍率加成",
        target: "$multiplier=3",
        targetRules: "$formula=sameElement$check=[4,4,4]",
    },

    "24256_W008": {
        ID: "24256_W008",
        name: "嫦娥",
        rarity: 3,
        sky: ["土", "火"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [50, 0, 0, 0, 50],
        ability: "搜尋",
        target: "$series=中秋$count=1",
    },

    "24256_W021": {
        ID: "24256_W021",
        name: "孫中山",
        rarity: 2,
        sky: ["金", "土"],
        ground: ["水", "木", "土"],
        person: ["火", "金", "土"],
        authorBuffs: [20, 0, 0, 0, 40],
        ability: "搜尋",
        target: "$series=澳門$count=1",
    },
}

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game",
        })
    }

    preload() {
        const wCards = ["W001", "W002", "W004", "W008", "W021"]
        const iCards = [
            "I019",
            "I021",
            "I028",
            "I029",
            "I035",
            "I037",
            "I040",
            "I049",
            "I052",
            "I059",
            "I060",
            "I069",
            "I071",
            "I074",
            "I077",
            "I080",
            "I083",
            "I085",
            "I086",
            "I087",
            "I087",
            "I097",
            "I100",
            "I102",
            "I103",
            "I104",
            "I120",
            "I123",
            "I124",
            "I125",
            "I128",
            "I130",
            "I140",
            "I143",
            "I144",
            "I145",
            "I146",
            "I151",
            "I153",
            "I155",
            "I157",
        ]
        const hCards = [
            "H019",
            "H036",
            "H037",
            "H042",
            "H043",
            "H045",
            "H053",
            "H063",
            "H066",
            "H068",
            "H073",
            "H075",
            "H090",
            "H098",
        ]
        const loadImages = (prefix, cardArray, path, format) => {
            cardArray.forEach((card) => {
                this.load.image(`${prefix}${card}`, require(`../../public/assets/${path}/${prefix}${card}.${format}`).default)
            })
        }
        const loadImages_new = (prefix, start, end, path, format) => {
            for (let i = start; i <= end; i++) {
                // Format the card ID to match the pattern
                const cardID = `${prefix}${i.toString().padStart(3, "0")}`
                this.load.image(cardID, require(`../../public/assets/${path}/${cardID}.${format}`).default)
            }
        }

        // Prefix / card number / path
        loadImages("24256_", wCards, "24256/WCard", "jpg")
        loadImages("24256_", iCards, "24256/ICard", "jpg")
        loadImages("24256_", hCards, "24256/HCard", "jpg")

        // loadImages_new("24256_W", 1, 21, "24256/WCard", "jpg")
        // loadImages_new("24256_I", 1, 105, "24256/ICard", "jpg")
        // loadImages_new("24256_H", 33, 49, "24256/HCard", "jpg")
        loadImages_new("Q", 1, 48, "QCard", "png")

        this.load.image("image_cardback", require("../../public/assets/others/image_cardback.png").default)
        this.load.image("BG", require("../../public/assets/others/WoodBackground.jpg").default)

        this.load.audio("BGM1", require("../sfx/BGM1.mp3").default)
        this.load.audio("flipCard1", require("../sfx/flipCard1.mp3").default)
        this.load.audio("flipCard2", require("../sfx/flipCard2.wav").default)
        this.load.audio("flipCard3", require("../sfx/flipCard3.wav").default)
        this.load.audio("dragCard", require("../sfx/dragCard.wav").default)

        // this.load.glsl("wipeShader", require("../shaders/linearwipe.glsl").default)
    }

    create() {
        // window.addEventListener("beforeunload", function (event) {
        //     // Optional: Inform the user about unsaved changes
        //     const confirmationMessage = "You have unsaved changes. Are you sure you want to leave?"
        //     event.returnValue = confirmationMessage // Standard for most browsers
        //     return confirmationMessage // For older browsers
        // })

        this.setupSounds()

        this.cameras.main.roundPixels = true
        this.scale.scaleMode = Phaser.Scale.ScaleModes.NEAREST
        // Ensure the canvas doesn't smooth images
        this.scale.canvas.setAttribute("image-rendering", "pixelated")

        this.CardStorage = new CardStorage(this)
        this.DeckHandler = new DeckHandler(this)
        this.GameHandler = new GameHandler(this)
        this.SocketHandler = new SocketHandler(this)
        this.ZoneHandler = new ZoneHandler(this)
        this.UIHandler = new UIHandler(this)
        this.QuestionCardHandler = new QuestionCardHandler(this)
        this.InteractiveHandler = new InteractiveHandler(this)
        this.Toast = new Toast(this)

        this.UIHandler.inputText = this.UIHandler.buildInputTextField(this.UIHandler.inputText)
        this.UIHandler.buildLobby()

        localStorage.removeItem("authorDeck")
    }

    setupSounds = () => {
        if (!this.backgroundMusic) {
            this.backgroundMusic = this.sound.add("BGM1") // Create the music only if it doesn't exist
            this.backgroundMusic.setLoop(true)
            this.backgroundMusic.play()
            this.backgroundMusic.setVolume(0.5)
        }

        this.sound.add("flipCard1")
        this.sound.add("flipCard2")
        this.sound.add("flipCard3")
        this.sound.add("dragCard")
    }

    update() {}
}
