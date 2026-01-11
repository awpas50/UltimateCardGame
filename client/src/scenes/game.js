import CardStorage from "../helpers/CardStorage"
import DeckHandler from "../helpers/DeckHandler"
import GameHandler from "../helpers/GameHandler"
import InteractiveHandler from "../helpers/InteractiveHandler"
import QuestionCardHandler from "../helpers/QuestionCardHandler"
import SocketHandler from "../helpers/SocketHandler"
import UIHandler from "../helpers/UIHandler"
import ZoneHandler from "../helpers/ZoneHandler"
import DebugHandler from "../helpers/DebugHandler"
import Toast from "../components/Toast"
import PointControlPopup from "../components/PointControlPopup"
import { loadWCardData } from "../database/gamedata.js"

// 靈感卡：編號/名稱/星數/屬性/系列/標籤/靈感值
export const ICard_Data_24256 = {
    "24256_I001": { ID: "24256_I001", name: "蟋蟀", rarity: 2, element: "土", series: "袁枚", tag: "", points: 10 },
    "24256_I002": { ID: "24256_I002", name: "幻想", rarity: 2, element: "水", series: "袁枚", tag: "", points: 60 },
    "24256_I003": { ID: "24256_I003", name: "奮臂", rarity: 4, element: "火", series: "袁枚", tag: "", points: 20 },
    "24256_I004": { ID: "24256_I004", name: "單縑", rarity: 3, element: "土", series: "袁枚", tag: "", points: 60 },
    "24256_I005": { ID: "24256_I005", name: "悲慟", rarity: 3, element: "水", series: "袁枚", tag: "", points: 70 },
    "24256_I006": { ID: "24256_I006", name: "瞠視", rarity: 4, element: "水", series: "袁枚", tag: "", points: 50 },
    "24256_I007": { ID: "24256_I007", name: "文墨", rarity: 4, element: "土", series: "袁枚", tag: "", points: 40 },
    "24256_I008": { ID: "24256_I008", name: "野史", rarity: 4, element: "金", series: "袁枚", tag: "", points: 40 },
    "24256_I009": { ID: "24256_I009", name: "氣絕", rarity: 4, element: "火", series: "袁枚", tag: "", points: 0 },
    "24256_I010": { ID: "24256_I010", name: "羈魂", rarity: 2, element: "木", series: "袁枚", tag: "", points: 20 },

    "24256_I011": { ID: "24256_I011", name: "紅燈", rarity: 3, element: "火", series: "袁枚", tag: "", points: 70 },
    "24256_I012": { ID: "24256_I012", name: "含飴", rarity: 3, element: "火", series: "袁枚", tag: "", points: 80 },
    "24256_I013": { ID: "24256_I013", name: "曉花", rarity: 4, element: "水", series: "袁枚", tag: "", points: 10 },
    "24256_I014": { ID: "24256_I014", name: "雞肥", rarity: 4, element: "火", series: "袁枚", tag: "", points: 30 },
    "24256_I015": { ID: "24256_I015", name: "偷靴", rarity: 4, element: "土", series: "袁枚", tag: "", points: 30 },
    "24256_I016": { ID: "24256_I016", name: "書生", rarity: 3, element: "火", series: "袁枚", tag: "", points: 50 },
    "24256_I017": { ID: "24256_I017", name: "明月", rarity: 1, element: "水", series: "中秋", tag: "", points: 80 },
    "24256_I018": { ID: "24256_I018", name: "清影", rarity: 3, element: "火", series: "中秋", tag: "", points: 60 },
    "24256_I019": { ID: "24256_I019", name: "雲母", rarity: 3, element: "金", series: "中秋", tag: "", points: 70 },

    "24256_I020": { ID: "24256_I020", name: "曉星", rarity: 2, element: "水", series: "中秋", tag: "", points: 60 },
    "24256_I021": { ID: "24256_I021", name: "靈藥", rarity: 2, element: "火", series: "中秋", tag: "", points: 20 },
    "24256_I022": { ID: "24256_I022", name: "夜心", rarity: 3, element: "水", series: "中秋", tag: "", points: 90 },
    "24256_I023": { ID: "24256_I023", name: "壺酒", rarity: 5, element: "水", series: "中秋", tag: "酒", points: 100 },
    "24256_I024": { ID: "24256_I024", name: "邀月", rarity: 3, element: "火", series: "中秋", tag: "", points: 30 },
    "24256_I025": { ID: "24256_I025", name: "雁聲", rarity: 4, element: "木", series: "中秋", tag: "", points: 80 },
    "24256_I026": { ID: "24256_I026", name: "棲鴉", rarity: 4, element: "木", series: "中秋", tag: "", points: 10 },
    "24256_I027": { ID: "24256_I027", name: "桂花", rarity: 2, element: "木", series: "中秋", tag: "", points: 40 },
    "24256_I028": { ID: "24256_I028", name: "蓼莪", rarity: 2, element: "木", series: "詩經", tag: "", points: 60 },
    "24256_I029": { ID: "24256_I029", name: "缾罍", rarity: 2, element: "金", series: "詩經", tag: "酒", points: 0 },

    "24256_I030": { ID: "24256_I030", name: "青蒿", rarity: 3, element: "木", series: "詩經", tag: "", points: 50 },
    "24256_I031": { ID: "24256_I031", name: "劬勞", rarity: 2, element: "水", series: "詩經", tag: "", points: 0 },
    "24256_I032": { ID: "24256_I032", name: "昊天", rarity: 5, element: "水", series: "詩經", tag: "", points: 100 },
    "24256_I033": { ID: "24256_I033", name: "楊柳", rarity: 4, element: "木", series: "詩經", tag: "", points: 0 },
    "24256_I034": { ID: "24256_I034", name: "雨雪", rarity: 4, element: "水", series: "詩經", tag: "", points: 40 },
    "24256_I035": { ID: "24256_I035", name: "關睢", rarity: 5, element: "木", series: "詩經", tag: "", points: 100 },
    "24256_I036": { ID: "24256_I036", name: "淑女", rarity: 4, element: "火", series: "詩經", tag: "", points: 20 },
    "24256_I037": { ID: "24256_I037", name: "荇菜", rarity: 4, element: "水", series: "詩經", tag: "", points: 20 },
    "24256_I038": { ID: "24256_I038", name: "終風", rarity: 4, element: "水", series: "詩經", tag: "", points: 10 },
    "24256_I039": { ID: "24256_I039", name: "木瓜", rarity: 2, element: "木", series: "詩經", tag: "", points: 60 },
    "24256_I040": { ID: "24256_I040", name: "相鼠", rarity: 2, element: "土", series: "詩經", tag: "", points: 50 },

    "24256_I041": { ID: "24256_I041", name: "碩鼠", rarity: 5, element: "土", series: "詩經", tag: "", points: 90 },
    "24256_I042": { ID: "24256_I042", name: "黍苗", rarity: 4, element: "土", series: "詩經", tag: "", points: 20 },
    "24256_I043": { ID: "24256_I043", name: "矛戟", rarity: 3, element: "金", series: "詩經", tag: "", points: 90 },
    "24256_I044": { ID: "24256_I044", name: "隰桑", rarity: 2, element: "木", series: "詩經", tag: "", points: 10 },
    "24256_I045": { ID: "24256_I045", name: "蔽日", rarity: 4, element: "木", series: "楚辭", tag: "", points: 50 },
    "24256_I046": { ID: "24256_I046", name: "矢墜", rarity: 3, element: "火", series: "楚辭", tag: "", points: 90 },
    "24256_I047": { ID: "24256_I047", name: "驂馬", rarity: 3, element: "火", series: "楚辭", tag: "", points: 70 },
    "24256_I048": { ID: "24256_I048", name: "秦弓", rarity: 3, element: "金", series: "楚辭", tag: "", points: 10 },
    "24256_I049": { ID: "24256_I049", name: "漁父", rarity: 4, element: "水", series: "楚辭", tag: "", points: 40 },
    "24256_I050": { ID: "24256_I050", name: "芰荷", rarity: 4, element: "木", series: "楚辭", tag: "", points: 40 },

    "24256_I051": { ID: "24256_I051", name: "芙蓉", rarity: 4, element: "木", series: "楚辭", tag: "", points: 10 },
    "24256_I052": { ID: "24256_I052", name: "山鬼", rarity: 5, element: "木", series: "楚辭", tag: "神", points: 90 },
    "24256_I053": { ID: "24256_I053", name: "蛾眉", rarity: 3, element: "火", series: "楚辭", tag: "", points: 20 },
    "24256_I054": { ID: "24256_I054", name: "心悅", rarity: 4, element: "木", series: "孔子", tag: "", points: 30 },
    "24256_I055": { ID: "24256_I055", name: "得閒", rarity: 2, element: "水", series: "孔子", tag: "", points: 70 },
    "24256_I056": { ID: "24256_I056", name: "師旅", rarity: 5, element: "火", series: "孔子", tag: "", points: 80 },
    "24256_I057": { ID: "24256_I057", name: "哂", rarity: 2, element: "水", series: "孔子", tag: "", points: 0 },
    "24256_I058": { ID: "24256_I058", name: "鼓瑟", rarity: 3, element: "土", series: "孔子", tag: "", points: 70 },
    "24256_I059": { ID: "24256_I059", name: "冠者", rarity: 3, element: "土", series: "孔子", tag: "", points: 20 },

    "24256_I060": { ID: "24256_I060", name: "社稷", rarity: 5, element: "土", series: "孔子", tag: "神", points: 100 },
    "24256_I061": { ID: "24256_I061", name: "虎兕", rarity: 3, element: "金", series: "孔子", tag: "", points: 80 },
    "24256_I062": { ID: "24256_I062", name: "龜玉", rarity: 4, element: "金", series: "孔子", tag: "", points: 30 },
    "24256_I063": { ID: "24256_I063", name: "干戈", rarity: 4, element: "金", series: "孔子", tag: "", points: 70 },
    "24256_I064": { ID: "24256_I064", name: "犬馬", rarity: 3, element: "土", series: "孔子", tag: "", points: 80 },
    "24256_I065": { ID: "24256_I065", name: "松柏", rarity: 3, element: "木", series: "孔子", tag: "", points: 70 },
    "24256_I066": { ID: "24256_I066", name: "好人", rarity: 2, element: "水", series: "孔子", tag: "", points: 0 },
    "24256_I067": { ID: "24256_I067", name: "惡人", rarity: 2, element: "水", series: "孔子", tag: "", points: 0 },
    "24256_I068": { ID: "24256_I068", name: "貧賤", rarity: 3, element: "土", series: "孔子", tag: "", points: 50 },
    "24256_I069": { ID: "24256_I069", name: "勿視", rarity: 3, element: "土", series: "孔子", tag: "", points: 90 },
    "24256_I070": { ID: "24256_I070", name: "棄甲", rarity: 3, element: "金", series: "孟子", tag: "", points: 0 },

    "24256_I071": { ID: "24256_I071", name: "數罟", rarity: 4, element: "土", series: "孟子", tag: "", points: 0 },
    "24256_I072": { ID: "24256_I072", name: "魚鼈", rarity: 2, element: "水", series: "孟子", tag: "", points: 80 },
    "24256_I073": { ID: "24256_I073", name: "斧斤", rarity: 3, element: "金", series: "孟子", tag: "", points: 90 },
    "24256_I074": { ID: "24256_I074", name: "雞豚", rarity: 2, element: "土", series: "孟子", tag: "", points: 80 },
    "24256_I075": { ID: "24256_I075", name: "狗彘", rarity: 2, element: "木", series: "孟子", tag: "", points: 80 },
    "24256_I076": { ID: "24256_I076", name: "餓莩", rarity: 3, element: "火", series: "孟子", tag: "", points: 50 },
    "24256_I077": { ID: "24256_I077", name: "四善", rarity: 2, element: "火", series: "孟子", tag: "", points: 40 },
    "24256_I078": { ID: "24256_I078", name: "揠苗", rarity: 2, element: "木", series: "孟子", tag: "", points: 30 },
    "24256_I079": { ID: "24256_I079", name: "釁鐘", rarity: 4, element: "金", series: "孟子", tag: "", points: 50 },
    "24256_I080": { ID: "24256_I080", name: "觳觫", rarity: 3, element: "水", series: "孟子", tag: "", points: 30 },

    "24256_I081": { ID: "24256_I081", name: "秋毫", rarity: 2, element: "木", series: "孟子", tag: "", points: 20 },
    "24256_I082": { ID: "24256_I082", name: "輿薪", rarity: 3, element: "木", series: "孟子", tag: "", points: 70 },
    "24256_I083": { ID: "24256_I083", name: "不能", rarity: 2, element: "水", series: "孟子", tag: "", points: 30 },
    "24256_I084": { ID: "24256_I084", name: "折枝", rarity: 3, element: "木", series: "孟子", tag: "", points: 50 },
    "24256_I085": { ID: "24256_I085", name: "知魚", rarity: 2, element: "水", series: "莊子", tag: "", points: 50 },
    "24256_I086": { ID: "24256_I086", name: "解牛", rarity: 3, element: "土", series: "莊子", tag: "", points: 30 },
    "24256_I087": { ID: "24256_I087", name: "庖丁", rarity: 5, element: "火", series: "莊子", tag: "", points: 90 },
    "24256_I088": { ID: "24256_I088", name: "東施", rarity: 2, element: "火", series: "莊子", tag: "", points: 30 },
    "24256_I089": { ID: "24256_I089", name: "神龜", rarity: 5, element: "木", series: "莊子", tag: "", points: 20 },
    "24256_I090": { ID: "24256_I090", name: "井蛙", rarity: 3, element: "木", series: "莊子", tag: "", points: 30 },

    "24256_I091": { ID: "24256_I091", name: "渾沌", rarity: 2, element: "火", series: "莊子", tag: "", points: 70 },
    "24256_I092": { ID: "24256_I092", name: "鯤鵬", rarity: 5, element: "水", series: "莊子", tag: "", points: 50 },
    "24256_I093": { ID: "24256_I093", name: "山木", rarity: 3, element: "木", series: "莊子", tag: "", points: 90 },
    "24256_I094": { ID: "24256_I094", name: "石匠", rarity: 4, element: "金", series: "莊子", tag: "", points: 60 },
    "24256_I095": { ID: "24256_I095", name: "夢蝶", rarity: 5, element: "土", series: "莊子", tag: "", points: 40 },
    "24256_I096": { ID: "24256_I096", name: "緣石", rarity: 4, element: "金", series: "澳門", tag: "", points: 30 },
    "24256_I097": { ID: "24256_I097", name: "猿石", rarity: 3, element: "木", series: "澳門", tag: "", points: 60 },
    "24256_I098": { ID: "24256_I098", name: "茶盅", rarity: 3, element: "金", series: "澳門", tag: "", points: 60 },
    "24256_I099": { ID: "24256_I099", name: "鬥蟀", rarity: 5, element: "木", series: "澳門", tag: "", points: 80 },
    "24256_I100": { ID: "24256_I100", name: "哪吒", rarity: 5, element: "火", series: "澳門", tag: "神", points: 100 },

    "24256_I101": { ID: "24256_I101", name: "蟾石", rarity: 3, element: "金", series: "澳門", tag: "", points: 40 },
    "24256_I102": { ID: "24256_I102", name: "乞婦", rarity: 4, element: "火", series: "澳門", tag: "", points: 10 },
    "24256_I103": { ID: "24256_I103", name: "彈珠", rarity: 3, element: "金", series: "澳門", tag: "", points: 20 },
    "24256_I104": { ID: "24256_I104", name: "醉龍", rarity: 2, element: "火", series: "澳門", tag: "", points: 90 },
    "24256_I105": { ID: "24256_I105", name: "栗子", rarity: 3, element: "土", series: "澳門", tag: "", points: 10 },
}

export const HCard_Data_24256 = {
    "24256_H033": { ID: "24256_H033", name: "禮儀遊戲" },
    "24256_H034": { ID: "24256_H034", name: "論語" },
    "24256_H035": { ID: "24256_H035", name: "不患寡貧" },
    "24256_H036": { ID: "24256_H036", name: "學而時習" },
    "24256_H037": { ID: "24256_H037", name: "非禮勿動" },
    "24256_H038": { ID: "24256_H038", name: "殺身成仁" },
    "24256_H039": { ID: "24256_H039", name: "過勿憚改" },
    "24256_H040": { ID: "24256_H040", name: "病無能焉" },
    "24256_H041": { ID: "24256_H041", name: "患不知人" },
    "24256_H042": { ID: "24256_H042", name: "溫故知新" },
    "24256_H043": { ID: "24256_H043", name: "欲速不達" },
    "24256_H044": { ID: "24256_H044", name: "己立立人" },
    "24256_H045": { ID: "24256_H045", name: "不相為謀" },
    "24256_H046": { ID: "24256_H046", name: "孟子" },
    "24256_H047": { ID: "24256_H047", name: "養生喪死" },
    "24256_H048": { ID: "24256_H048", name: "食不知檢" },
    "24256_H049": { ID: "24256_H049", name: "斷機教子" },
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
        loadWCardData()

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
        loadImages_new("25266_W", 1, 21, "25266/WCard", "jpg")
        loadImages_new("24256_I", 1, 105, "24256/ICard", "jpg")
        loadImages_new("24256_H", 33, 49, "24256/HCard", "jpg")
        loadImages_new("Q", 1, 48, "QCard", "png")

        // extra elements
        const extraElements = Array.from({ length: 5 }, (_, i) => `extra_element_${i}`)
        extraElements.forEach((element) => {
            this.load.image(element, require(`../../public/assets/extraElements/${element}.png`).default)
        })
        // extra Ipoints
        const extraIpoints = Array.from({ length: 10 }, (_, i) => `extra_number_${i * 10}`)
        extraIpoints.forEach((element) => {
            this.load.image(element, require(`../../public/assets/extraNumber/${element}.png`).default)
        })

        this.load.image("24256_W050", require("../../public/assets/others/24256_W050.jpg").default)
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
        this.PointControlPopup = new PointControlPopup(this)
        this.DebugHandler = new DebugHandler(this)
        this.UIHandler.buildLoginSection()
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

    showSaveSuccessToast = () => {
        this.Toast.showTopToast("已儲存角色卡組")
    }

    showSaveFailToast = () => {
        this.Toast.showTopToast("已捨棄角色卡組")
    }

    update() {}
}
