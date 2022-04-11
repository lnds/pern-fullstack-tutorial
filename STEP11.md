# Tests unitarios y de integración

En esta segunda parte re organizaremos el código del backend.
Como esta operación es delicada y debemos evitar introducir errores en código que ya funciona, vamos a implementar tests unitarios y de integración que podemos correr de manera automatizada.

## Instalando Jest y SuperTest

Usaremos los frameworks Jest y Supertest para ejecutar nuestras pruebas unitarias y de integación.

Para instalarlas hacemos:

    npm i --save-dev jest supertest

Con esto instalamos estos frameworks en el entorno de desarrollo de node (esto significa que cuando pasemos a producción nuestra aplicación estos packages no serán incluidos).

La guia de JEST está en esta url: https://jestjs.io/docs/expect


## Configurando una base de datos de testing

Creamos una base de datos de test:

    $ psql

    postgres=# create database test_db
    
    postgres=# \c test_db
    
    postgres=# CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
    );
    
    postgres=# \q

Más adelanta notarás que nuestros tests tienen implementada una función `resetDatabase()` que se encarga de limpiar la tabla `users`.

Esta función se llama usando las funciones propias de Jest `beforeAll()` y `afterAll()`.

## Probando jwtGenerator

Dentro de la carpeta `services` crea la carpeta `__tests__`, y dentro crea el archivo `jwtGenerator.test.js`:

```javascript
// services/__tests__/jwtGenerator.test.js

const config = require("../../config")
const jwt = require("jsonwebtoken")
const jwGenerator = require("../jwtGenerator")

const ourJwtSecret = 'secret-123'

// este mock cambia el valor que retorna la propiedad jwtSecret en el módulo `config`
jest.mock('../../config', () => {
    const originalModule = jest.requireActual('../../config')
    return {
        __esModule: true,
        ...originalModule,
        jwtSecret: ourJwtSecret
    }
})

// tests unitarios
describe('Valida el generador JWT', () => {
    it('Sin payload', () => {
        token = jwGenerator()
        expect(token).toBe('invalid token')
    })
    it('Con payload', () => {
        userId = 'user-name'
        token = jwGenerator(userId)
        payload = jwt.verify(token, ourJwtSecret)
        expect(payload).toHaveProperty('exp')
        expect(payload).toHaveProperty('iat')
        expect(payload).toHaveProperty('user')
        expect(payload.user).toEqual(userId)
    })
})
```

## Test de los endpoints de autorización

Vamos a crear la carpeta `__tests__` debajo de routes y dejaremos estos tres archivos:

`register.test.js`:

```javascript
// routes/__tests__/register.test.js

const config = require("../../config")
const pool = require("../../db")
const request = require('supertest')
const cors = require("cors")
const express = require("express")

app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', require('../auth'))

jest.mock('../../config', () => {
    const originalModule = jest.requireActual('../../config')
    return {
        __esModule: true,
        ...originalModule,
        connectionString: 'postgres://localhost:5432/test_db'
    }
})

beforeAll(async () => {
    resetDatabase()
})

afterAll(async () => {
    resetDatabase()
    await pool.end()
})

describe('Verifica rutas: /auth/register', () => {
    describe('POST /register', () => {
        it('Sin Body', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send()
            expect(res.statusCode).toEqual(401)
            expect(res.text).toBe('"Missing credentials"')
        })

        it('Con Body', async () => {
            const res = await request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .set('Accept', '/json/')
                .send({ name: 'Usuario', email: 'usuario@dominio.com', password: 'pass123' })
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('token')
        })

        it('Usuario duplicado', async () => {
            const res = await request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .set('Accept', '/json/')
                .send({ name: 'Usuario', email: 'usuario@dominio.com', password: 'pass123' })
            expect(res.statusCode).toEqual(401)
            expect(res.text).toBe('Usuario ya existe')
        })
    })
})

const resetDatabase = async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;")
}

```

`login.test.js`:

```javascript
// routes/__tests__/login.test.js

const config = require("../../config")
const pool = require("../../db")
const request = require('supertest')
const cors = require("cors")
const express = require("express")

app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', require('../auth'))

jest.mock('../../config', () => {
    const originalModule = jest.requireActual('../../config')
    return {
        __esModule: true,
        ...originalModule,
        connectionString: 'postgres://localhost:5432/test_db'
    }
})

beforeAll(async () => {
    resetDatabase()
})

afterAll(async () => {
    resetDatabase()
    await pool.end()
})

describe('Verifica rutas: /auth/login', () => {

    it('PreTest Init', async () => {
        await request(app)
            .post('/auth/register')
            .set('Content-Type', 'application/json')
            .set('Accept', /json/)
            .send({ name: 'Usuario', email: 'usuario@dominio.com', password: 'pass123' })
    })

    describe('POST /login', () => {
        it('Sin Body', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send()
            expect(res.statusCode).toEqual(401)
            expect(res.text).toBe('"Missing credentials"')
        })

        it('Con Body', async () => {
            const res = await request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .set('Accept', '/json/')
                .send({ email: 'usuario@dominio.com', password: 'pass123' })
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('token')
        })

        it('Email invalido', async () => {
            const res = await request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .set('Accept', '/json/')
                .send({ email: 'invalido@dominio.com', password: 'pass123' })
            expect(res.statusCode).toEqual(401)
            expect(res.text).toBe('"Password incorrecta o email no existe"')
        })

        it('Password invalido', async () => {
            const res = await request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .set('Accept', '/json/')
                .send({ email: 'usuario@dominio.com', password: 'pass12353' })
            expect(res.statusCode).toEqual(401)
            expect(res.text).toBe('"Password incorrecta o email no existe"')
        })
    })
})

const resetDatabase = async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;")
}

```

`is-verify.test.js`:

```javascript
// routes/__tests__/is-verify.test.js

const config = require("../../config")
const pool = require("../../db")
const request = require('supertest')
const cors = require("cors")
const express = require("express")

app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', require('../auth'))

jest.mock('../../config', () => {
    const originalModule = jest.requireActual('../../config')
    return {
        __esModule: true,
        ...originalModule,
        connectionString: 'postgres://localhost:5432/test_db'
    }
})

beforeAll(async () => {
    resetDatabase()
})

afterAll(async () => {
    resetDatabase()
    await pool.end()
})

describe('Verifica rutas: /auth/login', () => {

    it('PreTest Init', async () => {
        await request(app)
            .post('/auth/register')
            .set('Content-Type', 'application/json')
            .set('Accept', /json/)
            .send({ name: 'Usuario', email: 'usuario@dominio.com', password: 'pass123' })



    })

    it('GET /is-verify', async () => {
        const loginRes = await request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '/json/')
            .send({ email: 'usuario@dominio.com', password: 'pass123' })

        const res = await request(app)
            .get('/auth/is-verify')
            .set('Content-Type', 'application/json')
            .set('token', loginRes.body.token)
            .set('Accept', '/json/')
        expect(res.body).toEqual(true)
    })

    it('GET /is-verify', async () => {
        const res = await request(app)
            .get('/auth/is-verify')
            .set('Content-Type', 'application/json')
            .set('token', 'abcJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYjBlNjNhMjgtMDFkMy00MmY0LWJmYTctYTQwMDExNTAxMTYzIiwiaWF0IjoxNjQ5NjQyNzIyLCJleHAiOjE2NDk2NDYzMjJ9.NrytzA5HGPGYtGt_nMvblPp9gaRHpePZ8l1m5I2Bq5M')
            .set('Accept', '/json/')
        expect(res.body).toBe('Not authorized')
    })
})

const resetDatabase = async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;")
}

```

`profile.test.js`

```javascript
// routes/__tests__/profile.test.js

const config = require("../../config")
const pool = require("../../db")
const request = require('supertest')
const cors = require("cors")
const express = require("express")

app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', require('../auth'))
app.use('/profile', require('../profile'))

jest.mock('../../config', () => {
    const originalModule = jest.requireActual('../../config')
    return {
        __esModule: true,
        ...originalModule,
        connectionString: 'postgres://localhost:5432/test_db'
    }
})

beforeAll(async () => {
    resetDatabase()
})

afterAll(async () => {
    resetDatabase()
    await pool.end()
})

describe('Verifica rutas: /profile', () => {

    it('PreTest Init', async () => {
        await request(app)
            .post('/auth/register')
            .set('Content-Type', 'application/json')
            .set('Accept', /json/)
            .send({ name: 'Usuario', email: 'usuario@dominio.com', password: 'pass123' })
    })

    it('GET /profile', async () => {
        const loginRes = await request(app)
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '/json/')
            .send({ email: 'usuario@dominio.com', password: 'pass123' })

        const res = await request(app)
            .get('/profile')
            .set('token', loginRes.body.token)
            .set('Accept', '/json/')
        console.log(res.body)
        expect(res.body.name).toBe('Usuario')
    })

})

const resetDatabase = async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;")
}

```


## Ejecutar los tests

Ahora vamos a configurar node para que puedan correr nuestros tests:

Modifca el archivo `server/package.json` dejándolo así:

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest --detectOpenHandles"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@vscode/sqlite3": "^5.0.8",
    "bcrypt": "^5.0.1",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "jsonwebtoken": "^8.5.1",
    "pg": "^8.7.3"
  },
  "devDependencies": {
    "jest": "^27.5.1",
    "supertest": "^6.2.2"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }
}
```

El cambio importante está en la propiedad "scripts":

```json
"scripts": {
    "test": "jest --detectOpenHandles"
  },
```

Ahora puedes correr los tests del siguiente modo:

    $ npm test

    PASS  routes/__tests__/login.test.js
    PASS  routes/__tests__/is-verify.test.js
    PASS  routes/__tests__/register.test.js
    PASS  services/__tests__/jwtGenerator.test.js

    Test Suites: 5 passed, 5 total
    Tests:       15 passed, 15 total
    Snapshots:   0 total
    Time:        1.274 s
    Ran all test suites.

# A continuación 

Con esto terminamos la primera parte.

- [Siguiente paso](STEP12.md)
- [Tabla de contenido](README.md#Segunda-Parte)