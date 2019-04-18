declare class UnauthorizedError extends Error {
    code: string;
    status: number;
    inner: Error;

    constructor(code: string, error: Error);
}

export = UnauthorizedError;
