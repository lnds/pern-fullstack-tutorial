// routes/auth.js
const router = require("express").Router()
const users = require("../services/users")
const validateUserInfo = require("../middleware/validateUserInfo")
const authorization = require("../middleware/authorization")
const jwGenerator = require("../services/jwtGenerator")


// registrar usuario
router.post("/register", validateUserInfo, async (req, res) => {
    try {
        // 1. destructurar req.body para obtner (name, email, password)
        const { name, email, password } = req.body

        // 2. verificar si el usuario existe (si existe lanzar un error, con throw)
        const user = await users.findUserByEmail(email)

        if (user !== null) {
            return res.status(401).send("Usuario ya existe")
        }

        // 3. crear el usuario en la base de datos
        const newUser = await users.createUser(name, email, password)
        // 5. generar un token jwt
        const token = jwGenerator(newUser.id)
        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})

// verificar usuario
router.post("/login", validateUserInfo, async (req, res) => {
    try {
        // 1. destructurizar req.body
        const { email, password } = req.body

        // 2. verificar si el usuario no existe (si no emitiremos un error)
        const user = await users.findUserByEmail(email)

        if (user === null) {
            return res.status(401).json("Password incorrecta o email no existe")
        }

        // 3. verificar si la clave es la misma que está almacenada en la base de datos
        const validPassword = await user.validatePassword(password)
        if (!validPassword) {
            return res.status(401).json("Password incorrecta o email no existe")
        }

        // 4. entregar un token jwt 
        const token = jwGenerator(user.id)
        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})


router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router