import { DomainError, DomainErrorCode } from './domain.exception';

export class UnauthorizedOperation extends DomainError {
  constructor() {
    super({
      code: DomainErrorCode.UNAUTHORIZED,
      message: `Unauthorized operation`,
    });
  }
}
