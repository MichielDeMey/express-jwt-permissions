const util = require('util')
const get = require('lodash.get')

const UnauthorizedError = require('./error')
const PermissionError = new UnauthorizedError(
  'permission_denied', { message: 'Permission denied' }
)

const Guard = function (options) {
  const defaults = {
    requestProperty: 'user',
    permissionsProperty: 'permissions'
  }

  this._options = Object.assign({}, defaults, options)
}

function isString (value) {
  return typeof value === 'string'
}

function isArray (value) {
  return value instanceof Array
}

Guard.prototype = {

  check: function (required) {
    if (isString(required)) {
      required = [[required]]
    } else if (isArray(required) && required.every(isString)) {
      required = [required]
    }

    const _middleware = function _middleware (req, res, next) {
      const self = this
      const options = self._options

      if (!options.requestProperty) {
        return next(new UnauthorizedError('request_property_undefined', {
          message: 'requestProperty hasn\'t been defined. Check your configuration.'
        }))
      }

      const user = get(req, options.requestProperty, undefined)
      if (!user) {
        return next(new UnauthorizedError('user_object_not_found', {
          message: util.format('user object "%s" was not found. Check your configuration.', options.requestProperty)
        }))
      }

      let permissions = get(user, options.permissionsProperty, undefined)
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

      const sufficient = required.some(function (required) {
        return required.every(function (permission) {
          return permissions.indexOf(permission) !== -1
        })
      })

      next(!sufficient ? PermissionError : null)
    }.bind(this)

    _middleware.unless = require('express-unless')

    return _middleware
  }
}

module.exports = function (options) {
  return new Guard(options)
}
