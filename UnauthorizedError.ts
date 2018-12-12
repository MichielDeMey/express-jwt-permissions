import * as util from "util";

interface IError {
    message: string
}

export default class UnauthorizedError {
    name: string = this.constructor.name;
    message: string;
    code: string;
    status = 403
    inner: IError;

    constructor(code: string, error: IError) {
        Error.captureStackTrace(this, UnauthorizedError)

        this.message = error.message;
        this.code = code;
        this.inner = error;
    }
}

util.inherits(UnauthorizedError, Error)