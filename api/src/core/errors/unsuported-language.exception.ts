import { DomainError } from './domain.exception';

export class UnsuportedLanguageException extends DomainError {
  constructor(message: string) {
    super({ message });
  }
}
