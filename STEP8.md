# El middleware de validación de datos

Ahora vamos a crear un middleware que valide las credenciales entregadas por el frontend a los requests a nuestra API.

## El archivo validateUserInfo.js

Crea la carpeta `middleware` debajo de la carpeta `server`. Dentro de esta carpeta crea el archivo `validateUserInfo.js` con este código:

```javascript
// middleware/validateUserInfo.js
module.exports = (req, res, next) => {

    // función usada más adelante
    const validateEmail = (userEmail) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    }

    // 1. destructurar req.body para obtener credenciales
    const { email, name, password } = req.body

   // 2. validaciones para el registro de usuario
    if (req.path === "/register") {
        // 2.1 si alguno de estos valores falta retornamos error
        if (![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing credentials")
        } 
        // 2.2 si el email tiene un formato inválido retornamos error
        else if (!validateEmail(email)) {
            return res.status(401).json("Invalid email")
        }
    } 
    
    // 3. validaciones en el acceso (login)
    else if (req.path === "/login") {
        // 3.1 si alguno de estos valores falta retornamos error
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing credentials")
        } 
        // 3.2 si el email tiene un formato inválido retornamos error
        else if (!validateEmail(email)) {
            return res.status(401).json("Invalid email")
        }
    }

    // 4. continúa con el pipeline...
    next()
}
```

En este archivo hemos definido un middleware que usaremos a continuación.

## Agregando el middleware en `auth.js`

Modificaremos el archivo `routes/auth.js` del siguiente modo:

```javascript
// routes/auth.js
const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")
// agregamos esta linea:
const validateUserInfo = require("../middleware/validateUserInfo")
const jwGenerator = require("../services/jwtGenerator")


// registrar usuario
// -> notar que colocamos validateUserInfo entre "/register" y async
router.post("/register", validateUserInfo,  async (req, res) => { // y acá

// ...

// verificar usuario
router.post("/login", validateUserInfo,  async (req, res) => {
```

Notar que en las rutas para `/register` y `/login` hemos colocado nuestro middleware.

Si pruebas estos endpoints con email incorrectos, o dejando en blanco algunos valores podrás verificar los errores.

# A continuación 

- [Siguiente paso](STEP9.md)
- [Tabla de contenido](README.md#Pasos)