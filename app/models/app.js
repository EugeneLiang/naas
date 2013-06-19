
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * App schema
 */

var AppSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  key: { type: String, default: '' },
  deleted: { type: Boolean, default: false },
  user: { type: Schema.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

/**
 * Validations
 */

AppSchema.path('name').validate(function (name) {
  if (this.skipValidation) return true
  return name.trim().length
}, 'Please provide a valid name')

/**
 * Methods
 */

AppSchema.methods = {

}

/**
 * Statics
 */

AppSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    var criteria = options.criteria || {}
    var select = options.select || 'name description user createdAt'
    var populate = [{ path: 'user', select: 'name' }].concat(options.populate || [])

    // don't list the deleted
    criteria.deleted = false

    this.findOne(criteria)
      .select(select)
      .populate(populate)
      .exec(cb)
  },

  /**
   * List
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}
    var sort = options.sort || { 'createdAt': -1 }
    var limit = options.limit === 0 ? 0 : (options.limit || 10)
    var page = options.page || 0
    var select = options.select || 'name description user createdAt'
    var populate = [{ path: 'user', select: 'name' }].concat(options.populate || [])

    // don't list the deleted apps
    criteria.deleted = false

    this.find(criteria)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit)
      .skip(limit * page)
      .exec(cb)
  }
}

/**
 * Register schema
 */

mongoose.model('App', AppSchema)
