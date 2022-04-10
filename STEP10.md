# Obteniendo el perfil del usuario verificado

Ahora usaremos nuestro middleware de verificación para implementar un endpoint que entrega la información del usuario que ha ingresado al sistema, después de interactuar con login.

## La ruta `profile`

Vamos a crear un archivo dentro de la carpeta `routes` llamado `profile.js`:

```javascript
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
```

Esta ruta nos retorna información sobre el usuario, en este caso sólo retornaremos el nombre (más adelante podemos modificar esto).

Agregamos esta ruta en `index.js`:

```javascript
// index.js
// ...

// ROUTES
app.use("/auth", require("./routes/auth"))

app.use("/profile", require("./routes/profile"))

```

## Probando que todo funcione

Realizamos la prueba de la forma similar a como lo hicimos en el paso anterior:

1. Login: `curl -X POST -d '{"email": "email2@dominio.com", "password": "abc123" }' -H "Content-Type: application/json" http://localhost:3001/auth/login`
2. Respuesta obtenida: `{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMGNhMGUwMzctYTZhNi00ODEzLTgyMWEtOGI3M2NjOWJhNThlIiwiaWF0IjoxNjQ5NjAzMTE3LCJleHAiOjE2NDk2MDY3MTd9.Ac5_kJ-K1fz32gKgkO3T0YV58CYBCmklGZPbozQwtg8"}``
3. Llamada a `is-verify`: `curl -v http://localhost:3001/profile -H 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMGNhMGUwMzctYTZhNi00ODEzLTgyMWEtOGI3M2NjOWJhNThlIiwiaWF0IjoxNjQ5NjAzMTE3LCJleHAiOjE2NDk2MDY3MTd9.Ac5_kJ-K1fz32gKgkO3T0YV58CYBCmklGZPbozQwtg8'`
4. Respuesta obtenida: `{"name": "Eduardo"}`

# A continuación 

Con esto terminamos la primera parte.

- [Segunda Parte](README.md#Segunda-Parte)
- [Tabla de contenido](README.md#Primera-Parte)