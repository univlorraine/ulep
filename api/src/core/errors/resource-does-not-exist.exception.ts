import { DomainError, DomainErrorCode } from './domain.exception';

export class RessourceDoesNotExist extends DomainError {
  constructor(message?: string, code?: DomainErrorCode) {
    super({
      code: code ?? DomainErrorCode.RESSOURCE_NOT_FOUND,
      message: message ?? `Resource does not exist`,
    });
  }
}
