var test = require('tape')
var jwt_permissons = require('../lib')

var res = {}

var valid_permissions = {
  user: {
    permissions: {
      ping: true
    }
  }
}

var invalid_permission = {
  user: {
    permissions: {}
  }
}

var invalid_permission_noperm = {
  user: {}
}

var alternative_user_property = {
  identity: {
    permissions: {
      ping: true
    }
  }
}

var alternative_permissions_property = {
  identity: {
    actions: {
      ping: true
    }
  }
}

var nested_permissons = {
  user: {
    permissions: {
      ping: {
        read: true
      }
    }
  }
}

var valid_permission_array = {
  user: {
    permissions: ['ping']
  }
}

var invalid_permission_array = {
  user: {
    permissions: ['foo']
  }
}

test('Ignore unauthenticated routes', function (t) {
  var req = {}

  jwt_permissons('ping', true)(req, res, function (err) {
    t.end(err)
  })
})

test('User has permission', function (t) {
  var req = valid_permissions

  jwt_permissons('ping', true)(req, res, function (err) {
    t.end(err)
  })
})

test('User has permission (nested)', function (t) {
  var req = nested_permissons

  jwt_permissons('ping.read', true)(req, res, function (err) {
    t.end(err)
  })
})

test('User has permission (array)', function (t) {
  var req = valid_permission_array

  jwt_permissons('ping')(req, res, function (err) {
    t.end(err)
  })
})

test('User has permission (alternate userProperty)', function (t) {
  var req = alternative_user_property

  jwt_permissons('ping', true, { userProperty: 'identity' })(req, res, function (err) {
    t.end(err)
  })
})

test('User has permission (alternate permissionsProperty)', function (t) {
  var req = alternative_permissions_property

  jwt_permissons('ping', true, { permissionsProperty: 'actions' })(req, res, function (err) {
    t.end(err)
  })
})

test('User does not have permission', function (t) {
  t.plan(2)

  var req = invalid_permission

  jwt_permissons('ping', true)(req, res, function (err) {
    t.ok(err, 'Has error')
    t.equal(err.code, 'permission_denied')
  })
})

test('User does not have permission (nested)', function (t) {
  t.plan(2)

  var req = invalid_permission

  jwt_permissons('ping.read', true)(req, res, function (err) {
    t.ok(err, 'Has error')
    t.equal(err.code, 'permission_denied')
  })
})

test('User does not have permission (array)', function (t) {
  t.plan(2)

  var req = invalid_permission_array

  jwt_permissons('ping')(req, res, function (err) {
    t.ok(err, 'Has error')
    t.equal(err.code, 'permission_denied')
  })
})

test('User does not have permission (no permissions object)', function (t) {
  t.plan(2)

  var req = invalid_permission_noperm

  jwt_permissons('ping')(req, res, function (err) {
    t.ok(err, 'Has error')
    t.equal(err.code, 'permission_denied')
  })
})

test('Improper initialization', function (t) {
  t.test('Name is not set', function (t) {
    t.plan(1)

    var req = valid_permissions

    t.throws(function () {
      jwt_permissons(null, true)(req, res, null)
    }, /Error/)
  })

  t.test('Value is not set', function (t) {
    t.plan(1)

    var req = valid_permissions

    t.throws(function () {
      jwt_permissons('ping')(req, res, null)
    }, /Error/)
  })

  t.test('Both name and value are not set', function (t) {
    t.plan(1)

    var req = valid_permissions

    t.throws(function () {
      jwt_permissons({})(req, res, null)
    }, /Error/)
  })
})
