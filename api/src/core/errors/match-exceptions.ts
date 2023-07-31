import { DomainError } from './domain.exception';

export class InvalidCoeficientsError extends DomainError {
  constructor() {
    super({
      message: `The sum of all coeficients must be equal to 1.`,
    });
  }
}

export class SameProfilesError extends DomainError {
  constructor() {
    super({ message: 'Cannot compute match score between the same profile.' });
  }
}
