var tap = require('tap')
var test = tap.test
var guard = require('../index')()

var res = {}

test('no user object present, should throw', function (t) {
  var req = {}
  guard.check(['ping'])(req, res, function (err) {
    if (!err) return t.end('should throw an error')
    t.ok(err.code === 'user_object_not_found', 'correct error code')
    t.end()
  })
})

test('incorrect user object present, should throw', function (t) {
  t.plan(1)
  var guard = require('../index')({
    requestProperty: 'identity',
    permissionsProperty: 'bar'
  })
  var req = { user: { scopes: ['foobar'] } }
  guard.check('ping')(req, res, function (err) {
    if (!err) return t.end('should throw an error')
    t.ok(err.code === 'user_object_not_found', 'correct error code')
    t.end()
  })
})

test('valid permissions [Array] notation', function (t) {
  t.plan(1)
  var req = { user: { permissions: ['ping'] } }
  guard.check(['ping'])(req, res, t.error)
})

test('valid multiple permissions', function (t) {
  t.plan(1)
  var req = { user: { permissions: ['foo', 'bar'] } }
  guard.check(['foo', 'bar'])(req, res, t.error)
})

test('valid permissions [String] notation', function (t) {
  t.plan(1)
  var req = { user: { permissions: ['ping'] } }
  guard.check('ping')(req, res, t.error)
})

test('invalid permissions [Object] notation', function (t) {
  var req = { user: { permissions: { 'ping': true } } }
  guard.check('ping')(req, res, function (err) {
    if (!err) return t.end('should throw an error')
    t.ok(err.code === 'permissions_invalid', 'correct error code')
    t.end()
  })
})

test('permissions array not found', function (t) {
  var req = { user: {} }
  guard.check('ping')(req, res, function (err) {
    if (!err) return t.end('should throw an error')
    t.ok(err.code === 'permissions_not_found', 'correct error code')
    t.end()
  })
})

test('invalid requestProperty with custom options', function (t) {
  var guard = require('../index')({
    requestProperty: undefined,
    permissionsProperty: 'scopes'
  })
  var req = { identity: { scopes: ['ping'] } }
  guard.check('ping')(req, res, function (err) {
    if (!err) return t.end('should throw an error')

    t.ok(err.code === 'request_property_undefined', 'correct error code')
    t.end()
  })
})

test('valid permissions with custom options', function (t) {
  t.plan(1)
  var guard = require('../index')({
    requestProperty: 'identity',
    permissionsProperty: 'scopes'
  })
  var req = { identity: { scopes: ['ping'] } }
  guard.check('ping')(req, res, t.error)
})

test('invalid permissions [Array] notation', function (t) {
  var req = { user: { permissions: ['ping'] } }
  guard.check('foo')(req, res, function (err) {
    if (!err) return t.end('should throw an error')

    t.ok(err.code === 'permission_denied', 'correct error code')
    t.end()
  })
})

test('invalid required multiple permissions', function (t) {
  var req = { user: { permissions: ['foo'] } }
  guard.check(['foo', 'bar'])(req, res, function (err) {
    if (!err) return t.end('should throw an error')

    t.ok(err.code === 'permission_denied', 'correct error code')
    t.end()
  })
})

test('valid permissions with deep permissionsProperty', function (t) {
  t.plan(1)
  var guard = require('../index')({
    requestProperty: 'identity',
    permissionsProperty: 'scopes.permissions'
  })
  var req = { identity: { scopes: { permissions: ['ping'] } } }
  guard.check('ping')(req, res, t.error)
})

test('invalid permissions with deep permissionsProperty', function (t) {
  var guard = require('../index')({
    requestProperty: 'identity',
    permissionsProperty: 'scopes.permissions'
  })
  var req = { identity: { scopes: { permissions: ['ping'] } } }
  guard.check('foo')(req, res, function (err) {
    if (!err) return t.end('should throw an error')

    t.ok(err.code === 'permission_denied', 'correct error code')
    t.end()
  })
})

test('valid permissions with very deep permissionsProperty', function (t) {
  t.plan(1)
  var guard = require('../index')({
    requestProperty: 'identity',
    permissionsProperty: 'scopes.permissions.this.is.deep'
  })
  var req = { identity: { scopes: { permissions: { this: { is: { deep: ['ping'] } } } } } }
  guard.check('ping')(req, res, t.error)
})

test('OAuth space-delimited scopes', function (t) {
  t.plan(1)
  var req = { user: { permissions: 'ping foo bar' } }
  guard.check('foo')(req, res, t.error)
})
