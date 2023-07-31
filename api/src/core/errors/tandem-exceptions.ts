import { DomainError } from './domain.exception';

export class ProfileIsAlreadyInActiveTandemError extends DomainError {
  constructor(private readonly profileId: string) {
    super({
      message: `Profile with id ${profileId} is already in an active tandem`,
    });
  }
}

export class InvalidTandemError extends DomainError {
  constructor(private readonly reason: string) {
    super({ message: reason });
  }
}
