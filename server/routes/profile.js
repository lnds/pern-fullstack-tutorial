// routes/profile.js
const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

router.get("/", authorization, async (req, res) => {
    try {
        // 1. authorization agrega el valor user a req
        const userId = req.user

        // 2. buscamos el usuario en la base de datos (notar que sólo decidimos mostrar el nombre)
        const user = await pool.query("SELECT name FROM users WHERE id = $1", [userId])

        // 3. retornamos el usuario 
        res.json(user.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error")
    }
})

module.exports = router