var util = require('util')
var xtend = require('xtend')

var UnauthorizedError = require('./error')
var PermissionError = new UnauthorizedError(
  'permission_denied', { message: 'Permission denied' }
)

var Guard = function (options) {
  var defaults = {
    requestProperty: 'user',
    permissionsProperty: ['permissions']
  }

  if (options != null) {
    options.permissionsProperty = options.permissionsProperty.split('.')
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

      var permissions = user
      options.permissionsProperty.forEach(function (key) {
        try {
          permissions = permissions[key]
        } catch (e) {
          return next(new UnauthorizedError('property_invalid', {
            message: 'property isn\'t defined. Check your configuration.'
          }))
        }
      })

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
