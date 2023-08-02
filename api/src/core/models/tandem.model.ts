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
  readonly id: string;

  readonly profiles: Profile[];

  readonly status: TandemStatus;

  constructor(props: CreateTandemProps) {
    this.id = props.id;
    this.profiles = [...props.profiles];
    this.status = props.status;

    if (this.profiles.length !== 2) {
      throw new InvalidTandemError('Tandem must have exactly two profiles');
    }

    if (this.profiles[0].id === this.profiles[1].id) {
      throw new InvalidTandemError('Tandem must have two different profiles');
    }

    if (
      this.profiles[0].learningLanguage?.code !== this.profiles[1].nativeLanguage.code ||
      this.profiles[1].learningLanguage?.code !== this.profiles[0].nativeLanguage.code
    ) {
      throw new InvalidTandemError(
        'Leanring language and native language missmatch between profiles',
      );
    }
  }

  static create(props: CreateTandemProps): Tandem {
    return new Tandem(props);
  }
}
