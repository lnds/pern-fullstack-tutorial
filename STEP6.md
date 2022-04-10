# Generando un token JWT

En esta parte vamos a implementar el soporte de [JASON Web Token](https://jwt.io) (JWT) para poder implementar la autorización de acceso a nuestra API.

En el archivo titulado [Registro, Autenticación y Control de Acceso](AUTH.md) puedes leer más por qué necesitamos esto.

En [Qué es JWT](JWT.md) tienes una explicación sobre JWT.

Vamos a modificar el archivo `config.js` de este modo:

```javascript
// config.js
const dotenv = require('dotenv')

dotenv.config();

module.exports = {
    port: process.env.PORT,
    connectionString: process.env.CONNECTION_URL,
    jwtSecret: process.env.JWT_SECRET,
};
```

Fíjense que agregamos una variable de entorno `JWT_SECRET`, así que modifica el archivo `.env` agregándola:

```
PORT=3001
CONNECTION_URL=postgres://localhost:5432/blog_db
JWT_SECRET=super-secret-key-123
```

## El generador de JWT

Ahora vamos a crear un servicio interno que usaremos para generar JWT. Crea la carpeta `services` debajo de la carpeta `server` y dentro de esta agrega el archivo `jwtGenerator.js`:

```javascript
// services/jwGenerator.js
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config")

const jwGenerator = (userId) => {
    const payload = {
        user: userId,
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" })
}

module.exports = jwGenerator
```

## Modificar el archivo `routes/auth.js`

Ahora modificaremos el archivo `routes/auth.js`, eliminaremos la última sentencia del paso 4 y agregaremos el paso 5, esa sección del código debería quedar así:

```javascript
    // 4. agregar el usuario a la base de datos
    const newUser = await pool.query(
            "INSERT INTO users(name, email, password) values($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword])

    // 5. generar un token jwt
    const token = jwGenerator(newUser.rows[0].id)
    res.json({ token })
```

Y en la parte superior del archivo agregaremos la referencia a `jwtGenerator` quedando de este modo:

```javascript
// routes/auth.js
const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwGenerator = require("../services/jwtGenerator")
```

## Probando el servicio

Ejecuta curl de este modo:

```
$ curl -X POST -d '{"name": "Eduardo", "email": "email2@dominio.com", "password": "abc123" }' -H "Content-Type: application/json" http://localhost:3001/auth/register

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYjE0OGJkNWYtNmVmNi00MDYwLThhZjYtODIxNDBkMWQ5YjRiIiwiaWF0IjoxNjQ5NTU4NzUyLCJleHAiOjE2NDk1NjIzNTJ9.Zh63Ca0qPR9uYWwl7mlBWa3TejzJ8e18o0UFZB75DXY"}
```

El resultado de token puede ser distinto al que ves acá, depende de los valores con que configures la variable `JWT_SECRET` y de cuantos registros existan en la tabla `users`.

# A continuación 

- [Siguiente paso](STEP7.md)
- [Tabla de contenido](README.md#Primera-Parte)