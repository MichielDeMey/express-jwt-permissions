import express = require('express');
import unless = require('express-unless');

declare interface GuardOptions {
  requestProperty?: string
  permissionsProperty?: string
}

interface RequestHandlerEx extends express.RequestHandler {
  unless: typeof unless;
}

declare class Guard {
  public constructor(options?: GuardOptions);

  public check(required: string | string[] | string[][]): RequestHandlerEx;
}

declare function guardFactory(options?: GuardOptions): Guard;

declare namespace guardFactory {
}

export = guardFactory;
