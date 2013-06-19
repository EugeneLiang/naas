
/**
 * Module dependencies
 */

exports.index = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/apps')
  } else {
    res.render('home')
  }
}
