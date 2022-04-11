// services/jwGenerator.js
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config")

const jwGenerator = (userId) => {
    if (userId) {
        const payload = {
            user: userId,
        }
        return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" })
    }
    return "invalid token"
}

module.exports = jwGenerator
