export enum DomainErrorCode {
  RESSOURCE_NOT_FOUND = 'RESSOURCE_NOT_FOUND',
  RESSOURCE_ALREADY_EXIST = 'RESSOURCE_ALREADY_EXIST',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class DomainError extends Error {
  public readonly code: DomainErrorCode;

  constructor(
    message: string,
    code: DomainErrorCode = DomainErrorCode.BAD_REQUEST,
  ) {
    super(message);
    this.code = code;
  }
}
