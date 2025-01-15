import { DomainError } from './domain.exception';

export class RessourceIsUsed extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? `Resource is used`,
    });
  }
}
