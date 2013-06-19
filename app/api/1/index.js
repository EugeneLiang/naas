
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

exports.auth = function (req, res) {
  // if email or key is not present in the request body, its bad request
  if (!req.body.email || !req.body.key) {
    return res.json(400, { message: 'email or key is missing' })
  }

  var options = {
    criteria: { email: req.body.email, key: req.body.key },
    select: 'token'
  }

  User.load(options, function (err, user) {
    if (err || !user) {
      return res.json(401, { message: 'Invalid email or key' })
    }
    res.json({ token: user.authToken })
  })
}

/*!
 * API v1 documentation
 *
 * Reads json from the generated documentation, formats it and renders it
 */

exports.docs = function (req, res) {
  var fs = require('fs')
  var docs = __dirname + '/docs.json'
  var json

  // read from the generated docs file
  fs.readFile(docs, function (err, data) {
    json = JSON.parse(data)

    // don't include the ignored
    json = json.filter(function (obj) {
      return !obj.ignore
    })

    res.render('docs/1', {
      title: 'API version 1 documentation',
      json: info(json)
    })
  })
}

/*!
 * Format the docs json
 *
 * @param {Array} json
 * @return {Array}
 * @api private
 */

function info (json) {
  json = json.map(function (obj) {

    obj.text = stripHtml(obj.description.summary)
    obj.slug = makeSlug(obj.text)

    // put all the request params in params array
    obj.params = []

    // Decorate obj with method, version, endpoint, auth and params
    obj.tags = obj.tags.map(function (tag) {
      switch (tag.type) {
        case 'method':
          obj.method = tag.string
          break
        case 'version':
          obj.version = tag.string
          break
        case 'endpoint':
          obj.endpoint = tag.string
          break
        case 'auth':
          obj.auth = tag.string
          break
        case 'param':
          tag.type = tag.types[0]
          obj.params.push(tag)
          break
      }
      return tag
    })
    return obj
  })
  return json
}

/*!
 * Strip html
 *
 * @param {String} string
 * @return {String}
 * @api private
 */

function stripHtml (string) {
  return string.replace(/(<([^>]+)>)/ig,"")
}

/*!
 * Make slug
 *
 * Replace all spaces, characters with - and make the string lowercase
 *
 * @param {String} string
 * @return {String}
 * @api private
 */

function makeSlug (string) {
  return stripHtml(string).replace(/\ /g, '-').toLowerCase()
}
