# Express JWT Permissions

Middleware that checks JWT tokens for permissions, recommended to be used in conjunction with [express-jwt](https://github.com/auth0/express-jwt).

## Install

	npm install express-jwt-permissions --save

## Usage

This middleware assumes you already have a JWT authentication middleware such as [express-jwt](https://github.com/auth0/express-jwt).

The middleware will check a decoded JWT token to see if a token has permissions to make a certain request.

Permissions can be described as an array of strings,

```json
"permissions": [
	"status",
	"user_read",
	"user_write"
]
```

or as an object.

```json
"permissions": {
	"status": true,
	"user": {
		"read": true,
		"create": true
	}
}
```


### Using permission arrays
To verify a permission for all routes using an array:

```javascript
var jwt_permissons = require('express-jwt-permissions')

app.use(jwt_permissions('status'))
```

If you require different permissions per route, you can set the middleware per route.

```javascript
var jwt_permissons = require('express-jwt-permissions')

var permission_status    = jwt_permissions('status')
var permission_user_read = jwt_permissions('user_read', true)

app.get('/status', permission_status, function(req, res) { ... })
app.get('/user', permission_user_read, function(req, res) { ... })
```

### Using permission hashmaps

To verify a permission for all routes using a hashmap:

```javascript
var jwt_permissons = require('express-jwt-permissions')

app.use(jwt_permissions('status', true))
```

---

You can verify nested properties of permissions as well using the dot notation:

```javascript
var jwt_permissons = require('express-jwt-permissions')

app.use(jwt_permissions('user.read', true))
```

### Advanced Configuration
To set where the module can find the user property (default `req.user`) you can set the `userProperty` option.

To set where the module can find the permissions property inside the `userProperty` object (default `permissions`), set the `permissionsProperty` option.

Example:

Consider you've set your permissions as `actions` on `req.identity`:

```json
"actions": {
	"user": {
		"read": true,
		"write": true
	}
}
```

You can pass the configuration as the last argument:

```javascript
var jwt_permissons = require('express-jwt-permissions')

app.use(jwt_permissions('user.read', true, {
	userProperty: 'identity',
	permissionsProperty: 'actions'
}))
```

## Tests

    $ npm install
    $ npm test

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.