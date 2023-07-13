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

export class LanguageDoesNotExist extends RessourceDoesNotExist {
  constructor(public readonly field: string, public readonly value: string) {
    super('Language', field, value);
  }

  static withCodeOf(code: string): RessourceDoesNotExist {
    return new LanguageDoesNotExist('code', code);
  }
}

export class CountryDoesNotExist extends RessourceDoesNotExist {
  constructor(public readonly field: string, public readonly value: string) {
    super('Country', field, value);
  }

  static withIdOf(id: string): RessourceDoesNotExist {
    return new CountryDoesNotExist('id', id);
  }

  static withCodeOf(code: string): RessourceDoesNotExist {
    return new CountryDoesNotExist('code', code);
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

  static forUser(id: string): RessourceDoesNotExist {
    return new ProfileDoesNotExist('user', id);
  }
}

export class UserDoesNotExist extends RessourceDoesNotExist {
  constructor(public readonly field: string, public readonly value: string) {
    super('User', field, value);
  }

  static withIdOf(id: string): RessourceDoesNotExist {
    return new UserDoesNotExist('id', id);
  }

  static withEmailOf(email: string): RessourceDoesNotExist {
    return new UserDoesNotExist('email', email);
  }
}
