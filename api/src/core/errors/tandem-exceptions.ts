import { DomainError } from './domain.exception';

export class LearningLanguageIsAlreadyInActiveTandemError extends DomainError {
  constructor(private readonly learningLanguageId: string) {
    super({
      message: `LearningLanguage with id ${learningLanguageId} is already in an active tandem`,
    });
  }
}

export class ProfileIsNotInCentralUniversity extends DomainError {
  constructor(profileId: string) {
    super({
      message: `Profile ${profileId} is not in a central university`,
    });
  }
}

export class InvalidTandemError extends DomainError {
  constructor(private readonly reason: string) {
    super({ message: reason });
  }
}
