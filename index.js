var _every = require('lodash.every')
var _get = require('lodash.get')
var _includes = require('lodash.includes')
var xtend = require('xtend')

var UnauthorizedError = require('./error')
var PermissionError = new UnauthorizedError(
  'permission_denied', { message: 'Permission denied' }
)

var Guard = function (options) {
  var defaults = {
    requestProperty: 'user',
    permissionsProperty: 'permissions'
  }
  this._options = xtend(defaults, options)
}

Guard.prototype = {

  check: function (required) {
    if (typeof required === 'string') required = [required]

    return _middleware.bind(this)

    function _middleware (req, res, next) {
      var self = this
      var options = self._options

      var permissions = _get(req, [options.requestProperty, options.permissionsProperty])

      if (!permissions) {
        return next(new UnauthorizedError('permissions_not_found', {
          message: 'Could not find permissions for user. Bad configuration?'
        }))
      }

      if (!Array.isArray(permissions)) {
        return next(new UnauthorizedError('permissions_invalid', {
          message: 'Permissions should be an Array. Bad format?'
        }))
      }

      var sufficient = _every(required, function (permission) {
        return _includes(permissions, permission)
      })

      return next(!sufficient ? PermissionError : null)
    }
  }

}

module.exports = function (options) {
  return new Guard(options)
}
