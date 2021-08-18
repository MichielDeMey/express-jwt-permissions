import { RequestHandler } from "express-unless";

declare interface GuardOptions {
  requestProperty?: string
  permissionsProperty?: string
}

declare class Guard {
  public constructor(options?: GuardOptions);

  public check(required: string | string[] | string[][]): RequestHandler;
}

declare function guardFactory(options?: GuardOptions): Guard;

declare namespace guardFactory {
}

export = guardFactory;
