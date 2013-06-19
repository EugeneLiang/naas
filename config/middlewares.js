
/**
 * Module dependencies.
 */

exports.requiresLogin = function (req, res, next) {
  if (req.user)
    next()
  else
    return res.redirect('/')
}

/**
 * Check headers
 */

exports.checkHeaders = function (req, res, next) {
  next()
}
