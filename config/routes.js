
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var middlewares = require('./middlewares')
var passportOptions = {
  failureFlash: 'Invalid email or password.',
  failureRedirect: '/login'
}

/**
 * Route Middlewares
 */

var rl = middlewares.requiresLogin

/**
 * Controllers
 */

var users = require('users')
var apps = require('apps')
var home = require('home')

var api = require('../app/api/1')

/**
 * Expose Routes
 */

module.exports = function (app, passport) {

  app.get('/', home.index)
  app.get('/login', users.login)

  /**
   * Users
   */

  // sessions
  app.post(
    '/session',
    passport.authenticate('local', passportOptions),
    users.session
  )
  app.get('/logout', users.logout)

  // CRUD
  app.param('userId', users.load)
  app.get('/users', [rl], users.index)
  app.get('/users/new', users.new)
  app.post('/users', users.create)
  app.get('/users/:userId', [rl], users.show)
  app.get('/users/:userId/edit', [rl], users.edit)
  app.put('/users/:userId', [rl], users.update)
  app.del('/users/:userId', [rl], users.destroy)

  // CRUD
  app.param('orgId', apps.load)
  app.get('/apps', [rl], apps.index)
  app.get('/apps/new', [rl], apps.new)
  app.post('/apps', [rl], apps.create)
  app.get('/apps/:orgId', [rl], apps.show)
  app.get('/apps/:orgId/edit', [rl], apps.edit)
  app.put('/apps/:orgId', [rl], apps.update)
  app.del('/apps/:orgId', [rl], apps.destroy)

  /**
   * API namespacing
   */

  app.namespace('/api/1', middlewares.checkHeaders, api1)

  function api1 () {
    var api = require('../app/api/1')

    /**
     * API docs
     */

    app.get('/docs', [rl], api.docs)

    /**
     * Users API
     */

    app.post('/auth', api.auth)
  }
}
