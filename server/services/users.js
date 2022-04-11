// services/users.js

const pool = require("./db")
const crypt = require("./crypt")

const findUserById = async (userId) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId])
    return newUserObject(result.rows[0])
}

const findProfileById = async (userId) => {
    const result = await pool.query("SELECT name FROM users WHERE id = $1", [userId])
    return result.rows[0]
}

const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length == 0) {
        return null
    }
    return newUserObject(result.rows[0])
}

const createUser = async (name, email, plainPassword) => {
    const password = await crypt.encrypt(plainPassword)
    const newUser = await pool.query(
        "INSERT INTO users(name, email, password) values($1, $2, $3) RETURNING *",
        [name, email, password])
    return newUserObject(newUser.rows[0])
}

const newUserObject = (user) => {
    user.validatePassword = async function (plainPassword) {
        return await crypt.compare(plainPassword, this.password)
    }
    return user
}


module.exports = {
    findUserById,
    findProfileById,
    findUserByEmail,
    createUser,
}