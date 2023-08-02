/* eslint-disable prettier/prettier */
import { DomainError } from './domain.exception';

export class InvalidLevelException extends DomainError {
  constructor() {
    super({
      message: 'level must be one of the following values: A1, A2, B1, B2, C1, C2',
    });
  }
}
