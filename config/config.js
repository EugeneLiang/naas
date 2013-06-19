var path = require('path')
var root = path.resolve(__dirname + '../..')

module.exports = {
  development: {
    root: root,
    db: 'mongodb://localhost/NaasDev'
  },
  test: {
    root: root,
    db: 'mongodb://localhost/NaasTest'
  },
  staging: {
    root: root,
    db: process.env.MONGOHQ_URL
  },
  production: {
    root: root,
    db: process.env.MONGOHQ_URL
  }
}
