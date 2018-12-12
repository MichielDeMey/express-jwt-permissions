import * as util from "util";
import UnauthorizedError from "./UnauthorizedError";
import { IncomingMessage, ServerResponse } from "http";
var get = require('lodash.get');
//Issue with lodash type def not having module export
// import  * as get  from "lodash.get";

var PermissionError = new UnauthorizedError(
    'permission_denied', { message: 'Permission denied' }
)

interface IGueardOptions {
    requestProperty?: string,
    permissionsProperty?: string
}

export default class Guard {
    private defaults: IGueardOptions = {
        requestProperty: 'user',
        permissionsProperty: 'permissions'
    }

    public options: IGueardOptions;
    public required: Array<Array<string>> = [[]];

    constructor(options?: IGueardOptions) {
        this.options = Object.assign({}, this.defaults, options)
    }

    check(checkRequirements: string | Array<string>) {
        if (typeof checkRequirements === "string") {
            this.required = [[checkRequirements]]
        } else {
            this.required = [checkRequirements]
        }

        return middleware.bind(this);
    }
}

function middleware(this: Guard, req: IncomingMessage, res: ServerResponse, next: any) {
    if (!this.options.requestProperty) {
        return next(new UnauthorizedError('request_property_undefined', {
            message: 'requestProperty hasn\'t been defined. Check your configuration.'
        }))
    }

    var user = get(req, this.options.requestProperty, undefined)
    if (!user) {
        return next(new UnauthorizedError('user_object_not_found', {
            message: util.format('user object "%s" was not found. Check your configuration.', this.options.requestProperty)
        }))
    }

    var permissions = get(user, this.options.permissionsProperty, undefined)
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

    var sufficient = this.required.some(function (required: Array<String>) {
        return required.every(function (permission) {
            return permissions.indexOf(permission) !== -1
        })
    })

    next(!sufficient ? PermissionError : null)
}