# Refactorizando nuestro código

Hasta este punto tenemos que las rutas descritas en `routes/auth.js` y `routes/profile.js` acceden directamente al servicio `db.js` y ejecutan sentencias SQL directamente.

En un proyecto pequeño puede ser aceptable, pero en la medida que nuestro proyecto crece esta dependencia genera problemas.

Otro problema es que tenemos duplicidad de código que puede ser dificil de mantener a futuro (ver la implementación de '/login' y '/register', en ambos casos se repite una sentencia sql).

Otro problema es que si cambiamos la base de datos, o decidimos usar un ORM a futuro, realizar los cambios requerirá modificar demasiadas partes.

Por último no debería ser responsabilidad del enrutamiento el llamar a la base de datos.


## Asignando responsabilidades a servicios

Vamos a partir moviendo el archivo `db.js` a la carpeta `services`. 

Cuidado, esto requiere además que modifiquemos nuestros tests porque estos dependen de este servicio para configurarlo. Así que todos los archivos de test que están en la carpeta `server/routes/__tests__` debemos realizar este cambio:

Reemplazar `const pool = require("../../db")` por `const pool = require("../../services/db")

### El servicio `crypt`

Vamos a crear un servicio que encapsule los servicios de cryptografía provistos por bcrypt. Esto es porque quizás podriamos querer cambiar el algoritmo a futuro, entonces dejaremos esa responsabilidad en el archivo `services/crypt.js`:

```javascript
// services/crypt.js

const bcrypt = require("bcrypt")

const encrypt = async (password) => {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const bcryptPassword = await bcrypt.hash(password, salt)
    return bcryptPassword
}

const compare = async (plainPassword, password) => {
    return await bcrypt.compare(plainPassword, password)
}

module.exports = {
    encrypt,
    compare
}
```

Este servicio implementa dos funciones públicas: `encrypt` y `compare` que son lo que requerimos.

### El servicio `users`

Vamos a crear otro servicio que se preocupe de gestionar nuestra tabla de usuarios. De este modo las rutas no tienen porque saber los detalles de cómo se accede a la base de datos.

Crea el archivo `services/users.js`:

```javascript
// services/users.js

const pool = require("./db")
const crypt = require("./crypt")

const findUserById = async (userId) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId])
     if (result.rows.length === 0) {
        return null
    }
    return newUserObject(result.rows[0])
}

const findProfileById = async (userId) => {
    const result = await pool.query("SELECT name FROM users WHERE id = $1", [userId])
     if (result.rows.length === 0) {
        return null
    }
    return result.rows[0]
}

const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length == 0) {
        return null
    }
    return newUserObject(result.rows[0])
}

const createUser = async (name, email, plainPassword) => {
    const validateEmail = (userEmail) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    }

    if (![email, name, plainPassword].every(Boolean)) {
        return null
    }

    if (!validateEmail(email)) {
        return null
    }

    const password = await crypt.encrypt(plainPassword)
    const newUser = await pool.query(
        "INSERT INTO users(name, email, password) values($1, $2, $3) RETURNING *",
        [name, email, password])
    return newUserObject(newUser.rows[0])
}


const newUserObject = (user) => {
    user.validatePassword = async function (plainPassword) {
        return await crypt.compare(plainPassword, this.password)
    }
    return user
}


module.exports = {
    findUserById,
    findProfileById,
    findUserByEmail,
    createUser,
}
```

Este servicio provee cuatro funciones: `findUserById`, `findProfileById`, `findUserByEmail` y `createUser`.

Los nombres son bastante auto explicativos y pueden apreciar que encapsulan las consultas a la base de datos que teníamos en `auth.js` y `profile.js`.

Un punto importante es que `findUserById`, `findUserByEmail` y `createUser` antes de retornar el objeto user le agregan un método `validatePassword` al objeto retornado. Este método se usa para poder validar la password contenida en este objeto con un valor provisto por el usuario. Veremos como se usa esto en las rutas.

Fíjate que la funcion `createUser` aplica algunas validaciones, de modo que si estas fallan retorna null. Esto se repite con respecto al middleware `validateUserInfo.js`, más adelante mejoraremos esto.


## Cambios en las rutas

Ahora vamos a modificar el archivo `routes/profile.js`, el que quedará así:

```javascript
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
```

Fíjate que este archivo ya no depende de `db.js` y usa el servicio `users`, en particular la función `users.findProfileById()`.

Haremos lo mismo con `auth.js` que quedará así:

```javascript
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
```

Nuevamente todas las sentencias SQL han sido reemplazadas por llamadas al servicio `users`.

Y si corremos nuestro test todo debería estar bien:

    $ npm test
    PASS  routes/__tests__/login.test.js
    PASS  routes/__tests__/profile.test.js
    PASS  routes/__tests__/is-verify.test.js
    PASS  routes/__tests__/register.test.js
    PASS  services/__tests__/jwtGenerator.test.js

    Test Suites: 5 passed, 5 total
    Tests:       15 passed, 15 total
    Snapshots:   0 total
    Time:        1.239 s
    Ran all test suites.



# A continuación 

- [Siguiente paso](STEP13.md)
- [Tabla de contenido](README.md#Segunda-Parte)