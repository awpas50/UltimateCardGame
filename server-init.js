require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { google } = require("googleapis")
const fs = require("fs")

const server = express()
server.use(cors())

// Load credentials
const credentials = JSON.parse(fs.readFileSync("./google-sheets-api-credentials.json", "utf8"))
const SHEET_ID = process.env.GOOGLE_SHEET_ID

// Auth client
const jwtClient = new google.auth.JWT(credentials.client_email, null, credentials.private_key, [
    "https://www.googleapis.com/auth/spreadsheets",
])

// Sheets client (reuse this everywhere)
const sheets = google.sheets({ version: "v4", auth: jwtClient })

// Authorize once
jwtClient.authorize().catch((err) => console.error("Auth error:", err))

// --- Routes ---

// GET sheet data
// range: A1 notation (e.g., "Sheet1!A1:B2")
server.get("/api/get-sheet-data", async (req, res) => {
    try {
        const { range } = req.query
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range,
        })
        res.json(response.data.values)
    } catch (err) {
        console.error("[Error /api/get-sheet-data]", err)
        res.status(500).send("Error")
    }
})

// POST update sheet data
// range: A1 notation (e.g., "Sheet1!A1:B2")
server.post("/api/update-sheet-data/raw", async (req, res) => {
    try {
        const { range, value } = req.query
        const parsedValue = [value.split(",")] // supports comma-separated values

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range,
            valueInputOption: "RAW",
            resource: { values: parsedValue },
        })
        res.json(response.data)
    } catch (err) {
        console.error("[Error /api/update-sheet-data/raw]", err)
        res.status(500).send("Error")
    }
})

// WCard info: [0]ID [1]名稱 [2]星數 [3]天 [4]地 [5]人
// [6]屬性加成 (火) [7]屬性加成 (水) [8]屬性加成 (木) [9]屬性加成 (金) [10]屬性加成 (土)

// WCard ability: [11]技能類型(ability) [12]目標(target)
// [13]條件(targetRules) [14]主動技能(hasActiveSkill)
// [15]使用次數(abilityCharges)，不填不能用主動技能 [16]領域技能(globalEffect)
server.get("/api/get-wcard-info/25266", async (req, res) => {
    try {
        const range = "25266_作者卡!A5:Q100"
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range,
        })
        res.json(response.data.values)
    } catch (err) {
        console.error("[Error /api/get-wcard-info/25266]", err)
        res.status(500).send("Error")
    }
})

module.exports = server
