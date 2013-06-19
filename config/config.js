module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    db: 'mongodb://localhost/NaasDev',
    app: {
      name: 'Naas'
    },
  },
  test: {

  },
  production: {

  }
}