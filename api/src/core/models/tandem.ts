import { DomainError } from '../errors/errors';
import { Profile } from './profile';

export type TandemStatus = 'active' | 'inactive' | 'draft';

export type CreateTandemProps = {
  id: string;
  profiles: Profile[];
  status: TandemStatus;
};

export class Tandem {
  #id: string;
  #profiles: Profile[];
  #status: TandemStatus;

  constructor(props: CreateTandemProps) {
    this.#id = props.id;
    this.profiles = props.profiles;
    this.#status = props.status;
  }

  static create(props: CreateTandemProps): Tandem {
    return new Tandem(props);
  }

  get id(): string {
    return this.#id;
  }

  set profiles(profiles: Profile[]) {
    if (profiles.length !== 2) {
      throw new DomainError('Tandem must have exactly two profiles');
    }

    if (profiles[0].id === profiles[1].id) {
      throw new DomainError('Tandem must have two different profiles');
    }

    if (
      profiles[0].learningLanguage.code !== profiles[1].nativeLanguage.code ||
      profiles[1].learningLanguage.code !== profiles[0].nativeLanguage.code
    ) {
      throw new DomainError(
        'Leanring language and native language missmatch between profiles',
      );
    }

    this.#profiles = profiles;
  }

  get profiles(): Profile[] {
    return this.#profiles;
  }

  set status(status: TandemStatus) {
    this.#status = status;
  }

  get status(): TandemStatus {
    return this.#status;
  }
}
