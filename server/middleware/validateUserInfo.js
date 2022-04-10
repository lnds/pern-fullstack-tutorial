// middleware/validateUserInfo.js
module.exports = (req, res, next) => {
    const { email, name, password } = req.body

    const validateEmail = (userEmail) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    }

    if (req.path === "/register") {
        if (![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing credentials")
        } else if (!validateEmail(email)) {
            return res.status(401).json("Invalid email")
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing credentials")
        } else if (!validateEmail(email)) {
            return res.status(401).json("Invalid email")
        }
    }
    next()
}