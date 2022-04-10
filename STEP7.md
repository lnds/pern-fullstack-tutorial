# El enrutador de acceso login

Ahora agregaremos un router para validar la identidad de un usuario.

Agrega este código en `routes/auth.js`:

```javascript
// verificar usuario
router.post("/login", async (req, res) => {
    try {
        // 1. destructurizar req.body
        const { email, password } = req.body

        // 2. verificar si el usuario no existe (si no emitiremos un error)
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])

        if (user.rows.length === 0) {
            return res.status(401).json("Password incorrecta o email no existe")
        }

        // 3. verificar si la clave es la misma que está almacenada en la base de datos
        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!validPassword) {
            return res.status(401).json("Password incorrecta o email no existe")
        }

        // 4. entregar un token jwt 
        const token = jwGenerator(user.rows[0].id)
        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})
```

## Probando nuestro endpoint

Usaremos `curl` para probar el servicio `login`:


    curl -X POST -d '{"email": "email2@dominio.com", "password": "abc123" }' -H "Content-Type: application/json" http://localhost:3001/auth/login
    {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMGNhMGUwMzctYTZhNi00ODEzLTgyMWEtOGI3M2NjOWJhNThlIiwiaWF0IjoxNjQ5NTYxMTk3LCJleHAiOjE2NDk1NjQ3OTd9.vGeD0MalZmsWhkifYPsriEGCu6jpJ2gDRt2uBeyO4bc"}

# A continuación 

- [Siguiente paso](STEP8.md)
- [Tabla de contenido](README.md#Pasos)