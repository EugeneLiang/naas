
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var App = mongoose.model('App')
var utils = require('../../lib/utils')

/**
 * Load
 */

exports.load = function (req, res, next, appId) {
  var options = {
    criteria: { _id: appId }
  }

  App.load(options, function (err, app) {
    if (err) return next(err)
    if (!app) return next(new Error('Record not found'))
    req._app = app
    next()
  })
}

/**
 * List
 */

exports.index = function (req, res) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var limit = 10
  var criteria = {
    user: req.user._id
  }

  var options = {
    page: page,
    limit: limit,
    criteria: criteria
  }

  App.list(options, function (err, apps) {
    App.count(criteria).exec(function (err, count) {
      res.render('apps', {
        title: 'Your Apps',
        apps: apps,
        page: page,
        pages: Math.ceil(count / limit)
      })
    })
  })
}

/**
 * New app
 */

exports.new = function (req, res) {
  res.render('apps/new', {
    title: 'New App',
    app: new App()
  })
}

/**
 * Create app
 */

exports.create = function (req, res) {
  var app = new App()
  app.name = req.body.name
  app.description = req.body.description
  app.user = req.user._id

  app.save(function (err) {
    if (!err) {
      // reload user session
      req.flash('success', 'Successfully created ' + app.name)
      return res.redirect('/apps/' + app._id)
    }

    res.render('apps/new', {
      title: 'New App',
      app: app,
      errors: utils.errors(err.errors)
    })
  })
}

/**
 * Show App
 */

exports.show = function (req, res) {
  res.render('apps/show', {
    title: req._app.name,
    app: req._app
  })
}

/**
 * Edit App
 */

exports.edit = function (req, res) {
  res.render('apps/edit', {
    title: 'Edit App',
    app: req._app
  })
}

/**
 * Update App
 */

exports.update = function (req, res) {
  var app = req._app
  app.name = req.body.name
  app.description = req.body.description

  app.save(function (err) {
    if (err) {
      return res.render('apps/edit', {
        title: 'Edit App',
        app: app,
        errors: utils.errors(err.errors)
      })
    }

    req.flash('success', 'Successfully updated '+ app.name)
    res.redirect('/apps/' + app._id)
  })
}

/**
 * Destroy app
 */

exports.destroy = function (req, res) {
  var app = req._app
  var temp = req._app
  app.remove(function (err) {
    if (err) {
      req.flash('error', 'Oops! There was a problem deleting your app')
      return res.redirect('/apps/' + app._id)
    }

    req.flash('info', 'Successfully deleted App ' + temp.name)
    res.redirect('/apps')
  })
}
