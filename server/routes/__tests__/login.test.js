// routes/__tests__/login.test.js

const config = require("../../config")
const pool = require("../../services/db")
const request = require('supertest')

const app = require("../../index")

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
