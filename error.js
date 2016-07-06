var util = require('util');

module.exports = function UnauthorizedError (code, error) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = error;

  this.code = code;
  this.status = 403;
  this.inner = {message: error};
};

util.inherits(module.exports, Error);
