// services/jwGenerator.js
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config")

const jwGenerator = (userId) => {
    const payload = {
        user: userId,
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" })
}

module.exports = jwGenerator
