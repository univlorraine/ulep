import e from 'express';
import { DomainError, DomainErrorCode } from './errors';

export class RessourceDoesNotExist extends DomainError {
  constructor(
    private readonly ressource: string,
    public readonly field: string,
    public readonly value: string,
  ) {
    super(
      `${ressource} with ${field} ${value} does not exist`,
      DomainErrorCode.RESSOURCE_NOT_FOUND,
    );
  }
}

export class CountryDoesNotExist extends RessourceDoesNotExist {
  constructor(public readonly field: string, public readonly value: string) {
    super('Country', field, value);
  }

  static withIdOf(id: string): RessourceDoesNotExist {
    return new CountryDoesNotExist('id', id);
  }
}

export class UniversityDoesNotExist extends RessourceDoesNotExist {
  constructor(public readonly field: string, public readonly value: string) {
    super('University', field, value);
  }

  static withIdOf(id: string): RessourceDoesNotExist {
    return new UniversityDoesNotExist('id', id);
  }
}

export class ProfileDoesNotExist extends RessourceDoesNotExist {
  constructor(public readonly field: string, public readonly value: string) {
    super('Profile', field, value);
  }

  static withIdOf(id: string): RessourceDoesNotExist {
    return new ProfileDoesNotExist('id', id);
  }
}
