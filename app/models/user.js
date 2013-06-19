
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var userPlugin = require('mongoose-user')

/**
 * User schema
 */

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  key: { type: String, default: '' },
  authToken: { type: String, default: '' }
})

/**
 * User plugin
 */

UserSchema.plugin(userPlugin, {})

/**
 * Pre-save hooks
 */

UserSchema.pre('save', function (next) {
  var user = this

  if (user.isNew) {
    user.resetToken('key', function () {
      user.resetToken('authToken', next)
    })
  } else next()
})

/**
 * Validations
 */

UserSchema.path('email').validate(function (email, fn) {
  if (this.skipValidation) return fn(true)

  var User = mongoose.model('User')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    var criteria = { email: email }
    User.list({ criteria: criteria }, function (err, users) {
      fn(err || users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

/**
 * Virtuals
 */

UserSchema.virtual('avatar')
.get(function () {
  var gravatar = require('gravatar')
  return gravatar.url(this.email, { s: 140, d: 'mm' })
})

/**
 * Register UserSchema
 */

mongoose.model('User', UserSchema)
