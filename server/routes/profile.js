// routes/profile.js
const router = require("express").Router()
const users = require("../services/users")
const authorization = require("../middleware/authorization")

router.get("/", authorization, async (req, res) => {
    try {
        // 1. authorization agrega el valor user a req
        const userId = req.user

        // 2. buscamos el usuario en la base de datos (notar que sólo decidimos mostrar el nombre)
        const user = await users.findProfileById(userId)

        // 3. retornamos el usuario 
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error")
    }
})

module.exports = router