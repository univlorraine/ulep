import { DomainError, DomainErrorCode } from './errors';

export class RessourceAlreadyExists extends DomainError {
  constructor(
    private readonly ressource: string,
    public readonly field: string,
    public readonly value: string,
  ) {
    super(
      `${ressource} with ${field} ${value} already exists`,
      DomainErrorCode.RESSOURCE_ALREADY_EXIST,
    );
  }

  static withIdOf(ressource: string, id: string): RessourceAlreadyExists {
    return new RessourceAlreadyExists(ressource, 'id', id);
  }
}

export class UserAlreadyExists extends RessourceAlreadyExists {
  constructor(public readonly field: string, public readonly value: string) {
    super('User', field, value);
  }

  static withEmailOf(email: string): UserAlreadyExists {
    return new UserAlreadyExists('email', email);
  }
}

export class ProfileAlreadyExists extends RessourceAlreadyExists {
  constructor(public readonly field: string, public readonly value: string) {
    super('Profile', field, value);
  }

  static withIdOf(id: string): ProfileAlreadyExists {
    return new ProfileAlreadyExists('id', id);
  }

  static withEmailOf(email: string): ProfileAlreadyExists {
    return new ProfileAlreadyExists('email', email);
  }
}

export class UniversityAlreadyExists extends RessourceAlreadyExists {
  constructor(public readonly field: string, public readonly value: string) {
    super('University', field, value);
  }

  static withNameOf(name: string): UniversityAlreadyExists {
    return new UniversityAlreadyExists('name', name);
  }
}
