// auth.js
const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")

// registrar usuario
router.post("/", async (req, res) => {
    try {
        // 1. destructurar req.body para obtner (name, email, password)
        const { name, email, password } = req.body

        // 2. verificar si el usuario existe (si existe lanzar un error, con throw)
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])

        if (user.rows.length !== 0) {
            return res.status(401).send("Usuario ya existe")
        }

        // 3. Encriptar password usand bCrypt
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const bcryptPassword = await bcrypt.hash(password, salt)

        // 4. agregar el usuario a la base de datos
        const newUser = await pool.query(
            "INSERT INTO users(name, email, password) values($1, $2, $3)",
            [name, email, bcryptPassword])

        res.json(newUser.rows[0])

        // 5. generar un token jwt
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})

module.exports = router