declare class UnauthorizedError extends Error {
  public code: string;
  public status: number;
  public inner: Error;

  public constructor(code: string, error: Error);
}

export = UnauthorizedError;
