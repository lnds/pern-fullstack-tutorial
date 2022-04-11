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
