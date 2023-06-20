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
