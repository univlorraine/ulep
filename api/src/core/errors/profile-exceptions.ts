import { DomainError } from './domain.exception';

export class ProfileLanguagesException extends DomainError {
  constructor(message: string) {
    super({ message });
  }
}

export class ProfileCampusException extends DomainError {
  constructor(message: string) {
    super({ message });
  }
}
