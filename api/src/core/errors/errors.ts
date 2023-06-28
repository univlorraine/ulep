export enum DomainErrorCode {
  RESSOURCE_NOT_FOUND = 'RESSOURCE_NOT_FOUND',
  RESSOURCE_ALREADY_EXIST = 'RESSOURCE_ALREADY_EXIST',
}

export class DomainError extends Error {
  public readonly code: DomainErrorCode;

  constructor(message: string, code: DomainErrorCode) {
    super(message);
    this.code = code;
  }
}
