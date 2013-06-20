
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var User = mongoose.model('User')
var App = mongoose.model('App')

/**
 * Authorization
 *
 * Authenticates the user
 *
 * #### Example
 *
 * _Request_
 *
 *  request body:
 *
 *     {
 *       "email": "tom@example.com",
 *       "key": "YOUR_KEY"
 *     }
 *
 * If the request was successful, it should respond with 200 and token
 * If the auth failed, it responds with 401 and error message
 *
 * _Response_
 *
 * body:
 *
 *  successful response:
 *
 *     {
 *       "token": "SECRET_TOKEN"
 *     }
 *
 *  error responses:
 *
 *     {
 *       "message": "Invalid email or key"
 *     }
 *
 * @method POST
 * @version 1
 * @endpoint /auth
 */

module.exports = function (req, res) {
  // if email or key is not present in the request body, its bad request
  if (!req.body.email || !req.body.key) {
    return res.json(400, { message: 'email or key is missing' })
  }

  var options = {
    criteria: { email: req.body.email, key: req.body.key },
    select: 'authToken'
  }

  User.load(options, function (err, user) {
    if (err || !user) {
      return res.json(401, { message: 'Invalid email or key' })
    }
    res.json({ token: user.authToken })
  })
}
