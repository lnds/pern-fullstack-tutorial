// services/crypt.js

const bcrypt = require("bcrypt")

const encrypt = async (password) => {
    // 3. Encriptar password usand bCrypt
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const bcryptPassword = await bcrypt.hash(password, salt)
    return bcryptPassword
}

const compare = async (plainPassword, password) => {
    return await bcrypt.compare(plainPassword, password)
}

module.exports = {
    encrypt,
    compare
}