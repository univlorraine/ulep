/* eslint-disable prettier/prettier */

import { InvalidTandemError } from '../errors/tandem-exceptions';
import { Profile } from './profile.model';

export enum TandemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export type CreateTandemProps = {
  id: string;
  profiles: Profile[];
  status: TandemStatus;
};

// TODO: languageCode
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
      throw new InvalidTandemError('Tandem must have exactly two profiles');
    }

    if (profiles[0].id === profiles[1].id) {
      throw new InvalidTandemError('Tandem must have two different profiles');
    }

    if (
      profiles[0].languages.learning?.code !== profiles[1].languages.native.code ||
      profiles[1].languages.learning?.code !== profiles[0].languages.native.code
    ) {
      throw new InvalidTandemError(
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
