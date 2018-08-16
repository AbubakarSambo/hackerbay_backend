const verifyToken = require('../middleware/verifytoken.js')
const controller = require('../controllers/')

module.exports = (app) => {
  app.post('/login', controller.login)
  app.post('/patch', verifyToken, controller.patch)
  app.post('/thumbnail', verifyToken, controller.resize)
}
