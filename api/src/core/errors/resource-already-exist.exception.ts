import { DomainError, DomainErrorCode } from './domain.exception';

export class RessourceAlreadyExists extends DomainError {
  constructor() {
    super({
      code: DomainErrorCode.RESSOURCE_ALREADY_EXIST,
      message: `Resource already exists`,
    });
  }
}
