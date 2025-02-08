import CardStorage from "../helpers/CardStorage"
import DeckHandler from "../helpers/DeckHandler"
import GameHandler from "../helpers/GameHandler"
import InteractiveHandler from "../helpers/InteractiveHandler"
import QuestionCardHandler from "../helpers/QuestionCardHandler"
import SocketHandler from "../helpers/SocketHandler"
import UIHandler from "../helpers/UIHandler"
import ZoneHandler from "../helpers/ZoneHandler"
import Toast from "../helpers/Toast"
import { InputText, TextArea } from "phaser3-rex-plugins/templates/ui/ui-components.js"

// 編號/名稱/等級/天/地/人屬性
// 無屬性填 ["火", "水", "木", "金", "土"]

// 火/水/木/金/土屬性加成
// 例子: [0, 50, 0, -20, 0] 指水+50, 金-20.
export const WCard_Data_23246 = {
    "23246_W001": {
        ID: "23246_W001",
        name: "李煜",
        rarity: 2,
        sky: ["金", "水"],
        ground: ["土", "水", "木"],
        person: ["火", "水", "金"],
        authorBuffs: [0, 50, 0, -20, 0],
    },

    "23246_W002": {
        ID: "23246_W002",
        name: "孟子",
        rarity: 2,
        sky: ["土", "火"],
        ground: ["水", "火", "土"],
        person: ["木", "火", "金"],
        authorBuffs: [40, 0, 0, 0, 10],
    },

    "23246_W003": {
        ID: "23246_W003",
        name: "蘇軾",
        rarity: 2,
        sky: ["木", "火"],
        ground: ["金", "木"],
        person: ["水", "木"],
        authorBuffs: [0, 0, 30, 20, 0],
    },

    "23246_W004": {
        ID: "23246_W004",
        name: "莊子",
        rarity: 2,
        sky: ["土", "金"],
        ground: ["木", "土"],
        person: ["火", "土"],
        authorBuffs: [20, 0, 0, 0, 30],
    },

    "23246_W005": {
        ID: "23246_W005",
        name: "司馬遷",
        rarity: 2,
        sky: ["金", "土"],
        ground: ["土", "金", "水"],
        person: ["火", "金", "木"],
        authorBuffs: [0, 0, 0, 40, 20],
    },

    "23246_W006": {
        ID: "23246_W006",
        name: "童年袁枚",
        rarity: 1,
        sky: ["火", "土"],
        ground: ["水", "木"],
        person: ["火", "木"],
        authorBuffs: [10, 0, 20, 0, 0],
    },

    "23246_W007": {
        ID: "23246_W007",
        name: "袁枚",
        rarity: 3,
        sky: ["水", "火", "木"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [50, 0, 0, 0, 0],
    },

    "23246_W008": {
        ID: "23246_W008",
        name: "嫦娥",
        rarity: 3,
        sky: ["土", "火"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [50, 0, 0, 0, 50],
    },

    "23246_W009": {
        ID: "23246_W009",
        name: "李商隱",
        rarity: 3,
        sky: ["水"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [0, 20, 0, 0, 0],
    },

    "23246_W010": {
        ID: "23246_W010",
        name: "李白",
        rarity: 4,
        sky: ["木", "水", "火"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [60, 60, 0, 0, 0],
    },

    "23246_W011": {
        ID: "23246_W011",
        name: "杜甫",
        rarity: 1,
        sky: ["水", "金"],
        ground: ["水", "土"],
        person: ["金", "土"],
        authorBuffs: [0, 0, 0, 30, -30],
    },

    "23246_W012": {
        ID: "23246_W012",
        name: "屈原",
        rarity: 2,
        sky: ["水", "木"],
        ground: ["木", "土"],
        person: ["火", "木"],
        authorBuffs: [20, 0, 30, 0, 0],
    },

    "23246_W012": {
        ID: "23246_W012",
        name: "屈原",
        rarity: 2,
        sky: ["水", "木"],
        ground: ["木", "土"],
        person: ["火", "木"],
        authorBuffs: [20, 0, 30, 0, 0],
    },

    // "23246_W013": {
    //     ID: "23246_W013",
    //     name: "屈原",
    //     rarity: 1,
    //     sky: ["木", "水", "火"],
    //     ground: [],
    //     person: [],
    //     authorBuffs: [10, 10, 10, 0, 0],
    // },

    "23246_W014": {
        ID: "23246_W014",
        name: "童年孔子",
        rarity: 1,
        sky: ["土"],
        ground: ["金", "土"],
        person: ["火", "土"],
        authorBuffs: [0, 0, 0, 0, 20],
    },

    "23246_W015": {
        ID: "23246_W015",
        name: "孔子",
        rarity: 3,
        sky: ["金"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [0, 0, 0, 20, 0],
    },

    "23246_W016": {
        ID: "23246_W016",
        name: "童年孟子",
        rarity: 1,
        sky: ["水"],
        ground: ["土", "水"],
        person: ["火", "水"],
        authorBuffs: [0, 20, 0, 0, 0],
    },

    "23246_W017": {
        ID: "23246_W017",
        name: "管仲",
        rarity: 3,
        sky: ["水", "金", "火"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [0, 0, 0, 50, 0],
    },
}
// 靈感卡：編號/名稱/屬性/系列/靈感值
export const ICard_Data_23246 = {
    "23246_I002": { ID: "23246_I002", name: "幻想", element: "水", series: "袁枚系列", points: 60 },
    "23246_I006": { ID: "23246_I006", name: "瞠視", element: "水", series: "袁枚系列", points: 50 },
    "23246_I007": { ID: "23246_I007", name: "文墨", element: "土", series: "袁枚系列", points: 40 },
    "23246_I008": { ID: "23246_I008", name: "野史", element: "金", series: "袁枚系列", points: 40 },
    "23246_I013": { ID: "23246_I013", name: "曉花", element: "水", series: "袁枚系列", points: 10 },

    "23246_I019": { ID: "23246_I019", name: "雲母", element: "金", series: "中秋系列", points: 70 },
    "23246_I020": { ID: "23246_I020", name: "曉星", element: "水", series: "中秋系列", points: 60 },
    "23246_I021": { ID: "23246_I021", name: "靈藥", element: "火", series: "中秋系列", points: 20 },
    "23246_I022": { ID: "23246_I022", name: "夜心", element: "水", series: "中秋系列", points: 90 },
    "23246_I024": { ID: "23246_I024", name: "明月", element: "火", series: "中秋系列", points: 30 },

    "23246_I029": { ID: "23246_I029", name: "缾罍", element: "金", series: "詩經系列", points: 80 },
    "23246_I030": { ID: "23246_I030", name: "青蒿", element: "木", series: "詩經系列", points: 50 },
    "23246_I031": { ID: "23246_I031", name: "劬勞", element: "水", series: "詩經系列", points: 0 },
    "23246_I034": { ID: "23246_I034", name: "雨雪", element: "水", series: "詩經系列", points: 40 },
    "23246_I037": { ID: "23246_I037", name: "荇菜", element: "水", series: "詩經系列", points: 20 },
    "23246_I039": { ID: "23246_I039", name: "木瓜", element: "木", series: "詩經系列", points: 60 },
    "23246_I040": { ID: "23246_I040", name: "相鼠", element: "土", series: "詩經系列", points: 50 },

    "23246_I045": { ID: "23246_I045", name: "蔽日", element: "木", series: "楚辭系列", points: 50 },
    "23246_I046": { ID: "23246_I046", name: "矢墜", element: "火", series: "楚辭系列", points: 90 },
    "23246_I047": { ID: "23246_I047", name: "驂馬", element: "火", series: "楚辭系列", points: 70 },
    "23246_I049": { ID: "23246_I049", name: "漁父", element: "水", series: "楚辭系列", points: 60 },
    "23246_I051": { ID: "23246_I051", name: "芙蓉", element: "木", series: "楚辭系列", points: 10 },
    "23246_I055": { ID: "23246_I055", name: "得閒", element: "水", series: "楚辭系列", points: 70 },

    "23246_I059": { ID: "23246_I059", name: "冠者", element: "土", series: "孔子系列", points: 20 },
    "23246_I064": { ID: "23246_I064", name: "犬馬", element: "土", series: "孔子系列", points: 80 },
    "23246_I068": { ID: "23246_I068", name: "貧賤", element: "土", series: "孔子系列", points: 50 },

    "23246_I070": { ID: "23246_I070", name: "棄甲", element: "金", series: "孟子系列", points: 0 },
    "23246_I071": { ID: "23246_I071", name: "數罟", element: "土", series: "孟子系列", points: 0 },
    "23246_I072": { ID: "23246_I072", name: "魚鼈", element: "水", series: "孟子系列", points: 80 }, //roll dice
    "23246_I074": { ID: "23246_I074", name: "雞豚", element: "土", series: "孟子系列", points: 80 }, //roll dice
    "23246_I075": { ID: "23246_I075", name: "狗彘", element: "木", series: "孟子系列", points: 80 }, //roll dice
    "23246_I076": { ID: "23246_I076", name: "餓莩", element: "火", series: "孟子系列", points: 50 },
    "23246_I077": { ID: "23246_I077", name: "四善", element: "火", series: "孟子系列", points: 40 },
    "23246_I079": { ID: "23246_I079", name: "釁鐘", element: "金", series: "孟子系列", points: 50 },
    "23246_I081": { ID: "23246_I081", name: "秋毫", element: "木", series: "孟子系列", points: 40 },
    "23246_I082": { ID: "23246_I082", name: "輿薪", element: "木", series: "孟子系列", points: 70 },
    "23246_I083": { ID: "23246_I083", name: "不能", element: "水", series: "孟子系列", points: 80 },
    "23246_I084": { ID: "23246_I084", name: "折枝", element: "木", series: "孟子系列", points: 50 },
}

export const HCard_Data_23246 = {
    "23246_H001": { ID: "23246_H001" },
    "23246_H013": { ID: "23246_H013" },
    "23246_H025": { ID: "23246_H025" },
    "23246_H034": { ID: "23246_H034" },
    "23246_H036": { ID: "23246_H036" },
    "23246_H042": { ID: "23246_H042" },
    "23246_H044": { ID: "23246_H044" },
    "23246_H045": { ID: "23246_H045" },
    "23246_H046": { ID: "23246_H046" },
    "23246_H049": { ID: "23246_H049" },
    "23246_H050": { ID: "23246_H050" },
    "23246_H051": { ID: "23246_H051" },
    "23246_H052": { ID: "23246_H052" },
    "23246_H054": { ID: "23246_H054" },
    "23246_H055": { ID: "23246_H055" },
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

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game",
        })
    }

    preload() {
        // missing W013
        const wCards = [
            "W001",
            "W002",
            "W003",
            "W004",
            "W005",
            "W006",
            "W007",
            "W008",
            "W009",
            "W010",
            "W011",
            "W012",
            "W014",
            "W015",
            "W016",
            "W017",
        ]
        const iCards = [
            "I002",
            "I006",
            "I007",
            "I008",
            "I013",
            "I019",
            "I020",
            "I021",
            "I022",
            "I024",
            "I029",
            "I030",
            "I031",
            "I034",
            "I037",
            "I039",
            "I040",
            "I045",
            "I046",
            "I047",
            "I049",
            "I051",
            "I055",
            "I059",
            "I064",
            "I068",
            "I070",
            "I071",
            "I072",
            "I074",
            "I075",
            "I076",
            "I077",
            "I079",
            "I081",
            "I082",
            "I083",
            "I084",
        ]
        const hCards = [
            "H001",
            "H013",
            "H025",
            "H034",
            "H036",
            "H042",
            "H044",
            "H045",
            "H046",
            "H049",
            "H050",
            "H051",
            "H052",
            "H054",
            "H055",
        ]

        const qCards = [
            "Q001",
            "Q002",
            "Q003",
            "Q004",
            "Q005",
            "Q006",
            "Q007",
            "Q008",
            "Q009",
            "Q010",
            "Q011",
            "Q012",
            "Q013",
            "Q014",
            "Q015",
            "Q016",
            "Q017",
            "Q018",
            "Q019",
            "Q020",
            "Q021",
            "Q022",
            "Q023",
            "Q024",
            "Q025",
            "Q026",
            "Q027",
            "Q028",
            "Q029",
            "Q030",
            "Q031",
            "Q032",
            "Q033",
            "Q034",
            "Q035",
            "Q036",
            "Q037",
            "Q038",
            "Q039",
            "Q040",
            "Q041",
            "Q042",
            "Q043",
            "Q044",
            "Q045",
            "Q046",
            "Q047",
            "Q048",
        ]

        // Function to load images
        const loadImages = (prefix, cardArray, path, format) => {
            cardArray.forEach((card) => {
                this.load.image(
                    `${prefix}${card}`,
                    require(`../../public/assets/23246/${path}/${prefix}${card}.${format}`).default
                )
            })
        }

        // Prefix / card number / path
        loadImages("23246_", wCards, "WCard", "jpg")
        loadImages("23246_", iCards, "ICard", "jpg")
        loadImages("23246_", hCards, "HCard", "jpg")
        loadImages("", qCards, "QCard", "png")

        this.load.image("H001B", require("../../public/assets/Test/H001B.png").default)
        this.load.image("H001B_Filped", require("../../public/assets/Test/H001B_Filped.png").default)
        this.load.image("W001B", require("../../public/assets/Test/W001B.png").default)
        this.load.image("BG", require("../../public/assets/Test/WoodBackground.jpg").default)

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
        // Set scale mode
        this.scale.scaleMode = Phaser.Scale.ScaleModes.NEAREST
        // Ensure the canvas doesn't smooth images
        this.scale.canvas.setAttribute("image-rendering", "pixelated")
        // Check if the canvas exists
        // if (this.sys.game.canvas) {
        //     const context = this.sys.game.canvas.getContext('2d');
        //     // Check if the context and imageSmoothingQuality are supported
        //     if (context && 'imageSmoothingQuality' in context) {
        //         context.imageSmoothingQuality = 'high';
        //     } else {
        //         console.warn('Canvas context or imageSmoothingQuality is not supported in this browser.');
        //     }
        // } else {
        //     console.warn('Canvas element not found.');
        // }

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

        // let backgroundImage = this.add.image(0, 0, 'BG');
        // backgroundImage.setOrigin(0, 0);
        // backgroundImage.setDepth(0); // Set a depth level for the background
        // backgroundImage.disableInteractive();
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
