
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
var User = mongoose.model('User')
var utils = require('../../lib/utils')

/**
 * Load user
 */

exports.load = function (req, res, next, userId) {
  var options = {
    criteria: { _id: userId }
  }

  User.load(options, function (err, profile) {
    if (err) return next(err)
    if (!profile) return next(new Error('Record not found'))
    req.profile = profile
    next()
  })
}

/**
 * List users within the organization
 */

exports.index = function (req, res) {
  res.redirect('/')
}

/**
 * New user
 */

exports.new = function (req, res) {
  res.render('users/signup', {
    title: 'Signup',
    user: new User()
  })
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User()

  user.name = req.body.name
  user.email = req.body.email
  user.password = req.body.password

  user.save(function (err) {
    if (!err) {
      return req.logIn(user, function () {
        req.flash('success', 'Welcome ' + user.name + '. You just signed up!')
        res.redirect('/')
      })
    }

    res.render('users/signup', {
      title: 'Sign up to NAAS',
      user: user,
      errors: utils.errors(err.errors)
    })
  })
}

/**
 * Show user
 */

exports.show = function (req, res) {
  res.render('users/show', {
    user: req.profile,
    title: req.profile.name
  })
}

/**
 * Edit user
 */

exports.edit = function (req, res) {
  res.render('users/edit', {
    user: req.profile,
    title: 'Edit user '+ req.profile.name
  })
}

/**
 * Update user
 */

exports.update = function (req, res) {
  var user = req.profile

  user.name = req.body.name
  user.email = req.body.email

  user.save(function (err) {
    if (!err) {
      req.flash('success', 'Successfully updated user '+ user.name)
      return res.redirect('/users/' + user._id)
    }

    res.render('users/edit', {
      user: user,
      title: 'edit user '+ req.profile.name,
      errors: utils.errors(err.errors)
    })
  })
}

/**
 * Delete user
 */

exports.destroy = function (req, res) {
  res.redirect('/users')
}

/**
 * Create session
 */

exports.session = function (req, res) {
  /*if (req.body.rememberme) {
    res.cookie('rememberme', req.user.authToken, {
      expires: new Date(Date.now() + (364 * 24 * 60 * 60 * 1000)), // 364 days
      httpOnly: true
    })
  }*/

  res.redirect('/')
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  // res.clearCookie('rememberme')
  // req.session = null
  res.redirect('/')
}

/**
 * Login
 */

exports.login = function (req, res) {
  if (req.isAuthenticated()) return res.redirect('/')
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}
