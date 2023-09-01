import { DomainError } from './domain.exception';

export class LearningLanguageIsAlreadyInActiveTandemError extends DomainError {
  constructor(private readonly learningLanguageId: string) {
    super({
      message: `LearningLanguage with id ${learningLanguageId} is already in an active tandem`,
    });
  }
}

export class LearningLanguageHasNoAssociatedProfile extends DomainError {
  constructor(private readonly learningLanguageId: string) {
    super({
      message: `LearningLanguage with id ${learningLanguageId} has no associated profile`,
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

export class LearningLanguagesMustContainsProfilesForTandem extends DomainError {
  constructor() {
    super({
      message:
        "Cannot create tandem if learning languages doesn't contains profiles.",
    });
  }
}
