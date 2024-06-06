export enum DomainErrorCode {
  RESSOURCE_NOT_FOUND = 'RESSOURCE_NOT_FOUND',
  RESSOURCE_ALREADY_EXIST = 'RESSOURCE_ALREADY_EXIST',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export class DomainError extends Error {
  public readonly code: DomainErrorCode;

  constructor({ code, message }: { code?: DomainErrorCode; message: string }) {
    super(message);
    this.code = code ?? DomainErrorCode.BAD_REQUEST;
  }
}
