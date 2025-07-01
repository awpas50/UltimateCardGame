export default class AbilityReader {
    static getValueByTag = (text, tag) => {
        const regex = new RegExp(`\\${tag}=([^$]+)`)
        const match = text.match(regex)
        return match ? match[1] : null
    }
    static getMultipleValueByTag = (text, tag) => {
        const regex = new RegExp(`\\${tag}=([^$]+)`)
        const match = text.match(regex)
        return match ? match[1].split(",") : []
    }
}
