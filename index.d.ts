import {Handler} from 'express';

declare interface GuardOptions {
    someProperty: string;
}

declare class Guard {
    constructor(options: GuardOptions);

    check(required: string | Array<string>): Handler;
}

declare function guardFactory(options: GuardOptions): Guard;

export = guardFactory;
