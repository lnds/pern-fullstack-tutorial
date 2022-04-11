// index.js
const express = require("express")
const cors = require("cors")
const { port } = require("./config")

const app = express()

// midleware
app.use(express.json())
app.use(cors())


// ROUTES
app.use("/auth", require("./routes/auth"))

app.use("/profile", require("./routes/profile"))

if (require.main === module) {
    app.listen(port, () => {
        console.log("servidor iniciado en puerto: " + port)
    })
} else {
    module.exports = app
}
