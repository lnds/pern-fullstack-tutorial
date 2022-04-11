// services/__tests__/crypt.test.js

const crypt = require("../crypt")

// tests unitarios
describe('Valida el servicio crypt', () => {
    it('Compare contra el mismo valor', async () => {
        plainPassword = "password123"
        encryptedPassword = await crypt.encrypt("password123")
        expect(encryptedPassword).toBeTruthy()
        expect(await crypt.compare(plainPassword, encryptedPassword)).toBeTruthy()
    })

    it('Compare contra distinto valor', async () => {
        plainPassword = "password123"
        wrongPassword = "password-wrong"

        encryptedPassword = await crypt.encrypt("password123")
        expect(encryptedPassword).toBeTruthy()
        expect(await crypt.compare(wrongPassword, encryptedPassword)).toBeFalsy()
    })
})
