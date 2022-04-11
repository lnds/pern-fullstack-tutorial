// routes/__tests__/profile.test.js

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
        expect(res.body.name).toBe('Usuario')
    })

})

const resetDatabase = async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;")
}
