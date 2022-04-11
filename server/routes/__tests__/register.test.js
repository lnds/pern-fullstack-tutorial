// routes/__tests__/register.test.js

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
