// routes/__tests__/is-verify.test.js

const config = require("../../config")
const pool = require("../../db")
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
