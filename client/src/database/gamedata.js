import ApiDomain from "../mixins/ApiDomain.js"
// gameData.js
export const WCard_Data_25266 = {}

// WCard info: [0]ID [1]名稱 [2]星數 [3]天 [4]地 [5]人
// [6]屬性加成 (火) [7]屬性加成 (水) [8]屬性加成 (木) [9]屬性加成 (金) [10]屬性加成 (土)

// WCard ability: [11]技能類型(ability) [12]目標(target)
// [13]條件(targetRules) [14]主動技能(hasActiveSkill)
// [15]使用次數(abilityCharges)，不填不能用主動技能 [16]領域技能(globalEffect)

export async function loadWCardData() {
    let infoRes = await fetch(`${ApiDomain.name}/api/get-wcard-info/25266`).then((r) => r.json())
    let data = buildWCardInfo(infoRes)
    console.log("[WCard_Data_25266]:", data)
    // mutate the exported object so all imports see the update
    Object.assign(WCard_Data_25266, data)
}

function buildWCardInfo(data) {
    let result = {}
    data.forEach((row) => {
        const r = normalizeRow(row, 16)
        const id = `25266_${r[0]}`
        // 編號/名稱/等級/天/地/人屬性
        result[id] = {
            // 編號(ID)格式: 25266_W001
            ID: id,
            name: r[1],
            rarity: Number(r[2]),
            // 無屬性 = ["火", "水", "木", "金", "土"]
            sky: r[3] === "無" ? ["火", "水", "木", "金", "土"] : r[3] ? r[3].split(",").map((s) => s.trim()) : [],
            ground: r[4] === "無" ? ["火", "水", "木", "金", "土"] : r[4] ? r[4].split(",").map((s) => s.trim()) : [],
            person: r[5] === "無" ? ["火", "水", "木", "金", "土"] : r[5] ? r[5].split(",").map((s) => s.trim()) : [],
            // 火/水/木/金/土屬性加成
            // 例子: [0, 50, 0, -20, 0] 指水+50, 金-20.
            authorBuffs: [
                Number(r[6] || 0), // 火
                Number(r[7] || 0), // 水
                Number(r[8] || 0), // 木
                Number(r[9] || 0), // 金
                Number(r[10] || 0), // 土
            ],
            ability: r[11] || "",
            target: r[12] || "",
            targetRules: r[13] || "",
            hasActiveSkill: !!r[14], // check if has something
            abilityCharges: r[15] ? Number(r[15]) : null,
            globalEffect: !!r[16],
        }
    })
    return result
}

function normalizeRow(row, limit) {
    const copy = [...row]
    while (copy.length < limit) copy.push("")
    return copy
}
