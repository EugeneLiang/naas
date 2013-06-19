
/**
 * Module dependencies
 */

exports.index = function (req, res) {
  if (req.isAuthenticated()) {
    require('./apps').index(req, res)
  } else {
    res.render('home')
  }
}
