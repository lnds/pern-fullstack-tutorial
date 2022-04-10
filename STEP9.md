# Un middleware para validar si el usuario está verificado

Ahora vamos a construir una ruta que nos permita chequear desde el front que el usuario está verificado.

Recordemos que el token JWT puede haber expirado, o incluso ser inválido, así que el front tiene que tener una manera de verificarlo.

## El archivo middleware/authorization.js

Crea en la carpeta `middleware` el archivo `authorization.js` con el siguiente código:

```javascript
// middleware/authorization.js
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config")

// middleware de validación del token
module.exports = async (req, res, next) => {
    try {
        // 1. obtiene el token del header del request
        const jwToken = req.header("token")

        // 2. si no hay token presente es un error
        if (!jwToken) {
            return res.status(403).json("Not authorized")
        }

        // 3. valida el token y obtiene el payload, si falla tirará una excepción
        const payload = jwt.verify(jwToken, jwtSecret)

        // 4. rescatamos el payload y lo dejamos en req.user
        req.user = payload.user

        // 5. continua la ejecución del pipeline
        next()
    } catch (err) {
        console.error(err.message)
        return res.status(403).json("Not authorized")
    }
}
```

## Verificando 

Para probar esto debemos simular un login y luego una llamada `/is-verify`.

Usando curl ejecutamos estos comandos

1. Login: `curl -X POST -d '{"email": "email2@dominio.com", "password": "abc123" }' -H "Content-Type: application/json" http://localhost:3001/auth/login`
2. Respuesta obtenida: `{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMGNhMGUwMzctYTZhNi00ODEzLTgyMWEtOGI3M2NjOWJhNThlIiwiaWF0IjoxNjQ5NjAzMTE3LCJleHAiOjE2NDk2MDY3MTd9.Ac5_kJ-K1fz32gKgkO3T0YV58CYBCmklGZPbozQwtg8"}``
3. Llamada a `is-verify`: `curl -v http://localhost:3001/auth/is-verify -H 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMGNhMGUwMzctYTZhNi00ODEzLTgyMWEtOGI3M2NjOWJhNThlIiwiaWF0IjoxNjQ5NjAzMTE3LCJleHAiOjE2NDk2MDY3MTd9.Ac5_kJ-K1fz32gKgkO3T0YV58CYBCmklGZPbozQwtg8'`
4. Respuesta obtenida: `true`


# A continuación 

- [Siguiente paso](STEP10.md)
- [Tabla de contenido](README.md#Pasos)