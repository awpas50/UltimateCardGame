require("dotenv").config()
const express = require("express")
const cors = require("cors")
const server = express()
server.use(cors())

const { google } = require("googleapis")
const fs = require("fs")

const credentials = JSON.parse(fs.readFileSync("./google-sheets-api-credentials.json", "utf8"))

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const PRIVATE_KEY = credentials.private_key
const SERVICE_ACCOUNT = credentials.client_email

const jwtClient = new google.auth.JWT(SERVICE_ACCOUNT, null, PRIVATE_KEY, ["https://www.googleapis.com/auth/spreadsheets"])

jwtClient.authorize(function (err) {
    if (err) {
        console.log(err)
        return
    }
})

server.get("/account-info", (req, res) => {
    const sheets = google.sheets({ version: "v4", auth: jwtClient })
    sheets.spreadsheets.values.get(
        {
            spreadsheetId: SHEET_ID,
            range: "帳號!A2:B200",
        },
        (err, response) => {
            if (err) {
                console.error("[Error /account-info]" + err)
                res.status(500).send("Error")
                return
            }
            res.send(response.data.values)
        }
    )
})

module.exports = server
