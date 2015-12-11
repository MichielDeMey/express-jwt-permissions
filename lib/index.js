var get = require('lodash.get')
var isEqual = require('lodash.isequal')
var UnauthorizedError = require('./errors/UnauthorizedError')
var PermissionError = new UnauthorizedError('permission_denied', { message: 'Permission denied' })

module.exports = function (name, value, options) {
  // Support for shorthand arguments
  // e.g jwt_permissions('foo', true)
  if (typeof name === 'string') {
    options = options || {}

    options.name = name
    options.value = value || true
  } else if (name instanceof Object) {
    options = name
  }

  // Check options object
  if (options == null || options.name == null) {
    throw new Error('Permission name should be set')
  }

  // Set where we should find the 'user' property
  var _userProperty = options.userProperty || options.requestProperty || 'user'
  // Set where we should find the 'permissions' property
  var _permissionsProperty = options.permissionsProperty || 'permissions'

  var middleware = function (req, res, next) {
    var userObject = req[_userProperty]
    // If the _userProperty is not found
    // we assume it's an unauthenticated route
    if (!userObject) return next()

    // If the _userProperty is found
    // and we have no permission object, assume we're unauthorized
    var permObject = userObject[_permissionsProperty]
    if (!permObject) return next(PermissionError)

    // Support for Array based permissions
    if (permObject instanceof Array &&
        permObject.indexOf(options.name) !== -1) {
      return next()
    // Support for hashmap based permissions
    } else if (
        permObject instanceof Object &&
        !(permObject instanceof Array) &&
        options.value != null &&
        isEqual(get(permObject, options.name), options.value)) {
      return next()
    }

    next(PermissionError)
  }

  return middleware
}
