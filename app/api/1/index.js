
exports.auth = require('./auth')

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
