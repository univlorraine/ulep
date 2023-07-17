import { DomainError } from './errors';

export class ProfileIsAlreadyInActiveTandemError extends DomainError {
  constructor(private readonly profileId: string) {
    super(`Profile with id ${profileId} is already in an active tandem`);
  }
}
