// index.js
const express = require("express")
const cors = require("cors")
const { port } = require("./config")

const app = express()

// midleware
app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log("servidor iniciado en puerto: " + port)
})