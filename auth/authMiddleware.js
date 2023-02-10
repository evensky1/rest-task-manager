const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (!req.headers.authorization) return res.status(401).json({message: 'User is not authenticated'})
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({message: 'User is not authenticated'})
    req.user = jwt.verify(token, process.env.SECRET_KEY)
    next()
}