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


    const languagesSpokeByProfile1 = [this.profiles[0].nativeLanguage.code, ...this.profiles[0].masteredLanguages.map(language => language.code)];
    const languagesSpokeByProfile2 = [this.profiles[1].nativeLanguage.code, ...this.profiles[1].masteredLanguages.map(language => language.code)];
    // TODO(multipleLearningLanguage): manage multiple learning language
    if (
      !languagesSpokeByProfile1.includes(this.profiles[1].learningLanguages?.[0]?.language.code) ||
      !languagesSpokeByProfile2.includes(this.profiles[0].learningLanguages?.[0]?.language.code)
    ) {
      throw new InvalidTandemError(
        `Learning language and native/mastered language missmatch between profiles ${this.profiles[0].id} and ${this.profiles[1].id}`,
      );
    }
  }

  static create(props: CreateTandemProps): Tandem {
    return new Tandem(props);
  }
}
