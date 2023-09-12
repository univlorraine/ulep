import { DomainError, DomainErrorCode } from './domain.exception';

export class RessourceAlreadyExists extends DomainError {
  constructor(message?: string, code?: DomainErrorCode) {
    super({
      code: code ?? DomainErrorCode.RESSOURCE_ALREADY_EXIST,
      message: message ?? `Resource already exists`,
    });
  }
}
