var util = require('util')
var xtend = require('xtend')
var get = require('lodash.get')

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

      if (!options.requestProperty) {
        return next(new UnauthorizedError('request_property_undefined', {
          message: 'requestProperty hasn\'t been defined. Check your configuration.'
        }))
      }

      var user = req[options.requestProperty]
      if (!user) {
        return next(new UnauthorizedError('user_object_not_found', {
          message: util.format('user object "%s" was not found. Check your configuration.', options.requestProperty)
        }))
      }

      var permissions = get(user, options.permissionsProperty, undefined)
      if (!permissions) {
        return next(new UnauthorizedError('permissions_not_found', {
          message: 'Could not find permissions for user. Bad configuration?'
        }))
      }

      if (typeof permissions === 'string') {
        permissions = permissions.split(' ')
      }

      if (!Array.isArray(permissions)) {
        return next(new UnauthorizedError('permissions_invalid', {
          message: 'Permissions should be an Array or String. Bad format?'
        }))
      }

      var sufficient = required.every(function (permission) {
        return permissions.indexOf(permission) !== -1
      })

      return next(!sufficient ? PermissionError : null)
    }
  }

}

module.exports = function (options) {
  return new Guard(options)
}
