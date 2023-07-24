import { DomainError } from './errors';

export class ProfileLanguagesException extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
