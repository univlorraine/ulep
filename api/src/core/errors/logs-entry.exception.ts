import { DomainError } from './domain.exception';

export class LogEntryMissingMetadataException extends DomainError {
  constructor() {
    super({ message: 'Log entry missing metadata' });
  }
}
