var jwt = require('jsonwebtoken')
var config = require('../../config/config.js')

const verifyToken = (req, res, next) => {
  var token = req.headers['authorization']
  if (!token) { return res.status(403).send({ auth: false, message: 'No token provided.' }) }
  jwt.verify(token, config.secretKey, function (err) {
    if (err) { return res.status(500).send({ auth: false, message: 'unable to verify token' }) }

    next()
  })
}
module.exports = verifyToken
