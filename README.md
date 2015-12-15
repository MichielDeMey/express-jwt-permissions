# Express JWT Permissions

[![Build Status](https://travis-ci.org/MichielDeMey/express-jwt-permissions.svg?branch=master)](https://travis-ci.org/MichielDeMey/express-jwt-permissions)
[![Coverage Status](https://coveralls.io/repos/MichielDeMey/express-jwt-permissions/badge.svg?branch=master&service=github)](https://coveralls.io/github/MichielDeMey/express-jwt-permissions?branch=master)

Middleware that checks JWT tokens for permissions, recommended to be used in conjunction with [express-jwt](https://github.com/auth0/express-jwt).

## Install

```
npm install express-jwt-permissions --save
```

## Usage

This middleware assumes you already have a JWT authentication middleware such as [express-jwt](https://github.com/auth0/express-jwt).

The middleware will check a decoded JWT token to see if a token has permissions to make a certain request.

Permissions should be described as an array of strings inside the JWT token.

```json
"permissions": [
  "status",
  "user:read",
  "user:write"
]
```

If your JWT structure looks different you should map or reduce the results to produce a simple Array of permissions.

### Using permission Array
To verify a permission for all routes using an array:

```javascript
var guard = require('express-jwt-permissions')()

app.use(guard.check('admin'))
```

If you require different permissions per route, you can set the middleware per route.

```javascript
var guard = require('express-jwt-permissions')()

app.get('/status', guard.check('status'), function(req, res) { ... })
app.get('/user', guard.check(['user:read']), function(req, res) { ... })
```

### Configuration
To set where the module can find the user property (default `req.user`) you can set the `requestProperty` option.

To set where the module can find the permissions property inside the `requestProperty` object (default `permissions`), set the `permissionsProperty` option.

Example:

Consider you've set your permissions as `scopes` on `req.identity`, your JWT structure looks like:

```json
"scopes": ["user:read", "user:write"]
```

You can pass the configuration into the module:

```javascript
var guard = require('express-jwt-permissions')({
  requestProperty: 'identity',
  permissionsProperty: 'scopes'
})

app.use(guard.check('user:read'))
```

## Tests

    $ npm install
    $ npm test

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
