import { DomainError } from './domain.exception';

// This exception is thrown when the content type of the file is not allowed.
export class ContentTypeException extends DomainError {
  name = 'ContentTypeException';

  constructor(type: string) {
    super({ message: `Unallowed content type: ${type}` });
  }
}
