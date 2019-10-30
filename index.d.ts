import { Handler } from 'express'

declare interface GuardOptions {
  requestProperty?: string
  permissionsProperty?: string
}

declare class Guard {
  public constructor(options: GuardOptions);

  public check(required: string | string[] | string[][]): Handler;
}

declare function guardFactory(options: GuardOptions): Guard;

declare namespace guardFactory {
}

export = guardFactory;
