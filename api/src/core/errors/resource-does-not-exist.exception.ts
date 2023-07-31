import { DomainError, DomainErrorCode } from './domain.exception';

export class RessourceDoesNotExist extends DomainError {
  constructor() {
    super({
      code: DomainErrorCode.RESSOURCE_NOT_FOUND,
      message: `Resource does not exist`,
    });
  }
}
