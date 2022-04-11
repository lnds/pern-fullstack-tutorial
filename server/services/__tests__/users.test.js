// services/__tests__/users.test.js

const pool = require("../../services/db")
const users = require("../users")

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


describe('Verifica servicio usres', () => {
    describe('Creación de usuario', () => {
        it('Caso feliz', async () => {
            const user = await users.createUser("usuario", "email@dominio.com", "password")
            expect(user.name).toBe("usuario")
            expect(user.email).toBe("email@dominio.com")
            expect(user.password).not.toBe("password")
            expect(await user.validatePassword("password")).toBeTruthy()
            const findUser = await users.findUserById(user.id)
            expect(findUser).not.toBeNull()
            expect(findUser.name).toEqual(user.name)
            expect(findUser.email).toEqual(user.email)
            expect(findUser.password).toEqual(user.password)
        })

        it('Usuario en blanco', async () => {
            const user = await users.createUser("", "email2@dominio.com", "password2")
            expect(user).toBeNull()
            const findUser = await users.findUserByEmail("email2@dominio.com")
            expect(findUser).toBeNull()
        })

        it('Email incorrecto', async () => {
            const user = await users.createUser("usuario", "email2_dominio.com", "password2")
            expect(user).toBeNull()
            const findUser = await users.findUserByEmail("email2_dominio.com")
            expect(findUser).toBeNull()
        })

        it('Password en blanco', async () => {
            const user = await users.createUser("usuario nuevo", "email2@dominio.com", "")
            expect(user).toBeNull()
            const findUser = await users.findUserByEmail("email2@dominio.com")
            expect(findUser).toBeNull()
        })

        it('Usuario ya existe', async () => {
            await expect(async () => {
                await users.createUser("usuario", "email@dominio.com", "password")
            }).rejects.toThrow('duplicate key')
        })
    })

    describe('Buscar usuario', () => {
        it('inicializa usuaro', async () => {
            await users.createUser("usuario2", "email2@dominio.com", "password2")
        })

        it('buscar por email y por id', async () => {
            const user = await users.findUserByEmail("email2@dominio.com")
            expect(user).toBeDefined()
            expect(user.email).toBe("email2@dominio.com")

            const findUser = await users.findUserById(user.id)
            expect(findUser).toBeDefined()
            expect(findUser.email).toBe("email2@dominio.com")

            expect(user.id).toBe(findUser.id)
            expect(user.name).toBe(findUser.name)
            expect(user.email).toBe(findUser.email)
        })

        it('buscar por email que no esta', async () => {
            const user = await users.findUserByEmail("bad-email@dominio.com")
            expect(user).toBeNull()
        })

        it('buscar por id que no esta', async () => {
            const user = await users.findUserById("75066501-bad0-badc-8e57-770e8ac417a7")
            expect(user).toBeNull()
        })
    })

    describe('Buscar perfil', () => {
        it('inicializa usuaro', async () => {
            await users.createUser("usuario3", "email3@dominio.com", "password2")
        })

        it('buscar perfil por id usuario que existe', async () => {
            const user = await users.findUserByEmail("email3@dominio.com")
            expect(user).toBeDefined()
            expect(user.email).toBe("email3@dominio.com")

            const profile = await users.findProfileById(user.id)
            expect(profile).toBeDefined()
            expect(profile.name).toBe("usuario3")
            expect(profile).not.toHaveProperty("password")

        })

        it('buscar perfil por id  que no existe', async () => {
            const profile = await users.findProfileById("75066501-bad0-badc-8e57-770e8ac417a7")
            expect(profile).toBeNull()
        })

    })
})

const resetDatabase = async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;")
}


