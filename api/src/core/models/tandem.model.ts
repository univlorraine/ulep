/* eslint-disable prettier/prettier */

import { InvalidTandemError, LearningLanguagesMustContainsProfilesForTandem } from '../errors/tandem-exceptions';
import { LearningLanguage } from './learning-language.model';

export enum TandemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export type CreateTandemProps = {
  id: string;
  learningLanguages?: LearningLanguage[];
  status: TandemStatus;
};

export class Tandem {
  readonly id: string;

  readonly learningLanguages?: LearningLanguage[];

  readonly status: TandemStatus;

  constructor(props: CreateTandemProps) {
    this.id = props.id;
    this.status = props.status;
    
    if (props.learningLanguages) {
      this.learningLanguages = [...props.learningLanguages];
      this.assertNoErrors();
    }
  }

  static create(props: CreateTandemProps): Tandem {
    return new Tandem(props);
  }

  private assertNoErrors() {
    if (this.learningLanguages.length !== 2) {
      throw new InvalidTandemError('Tandem must have exactly two learning languages');
    }

    if (this.learningLanguages[0].id === this.learningLanguages[1].id) {
      throw new InvalidTandemError('Tandem must have two different learning languages');
    }
    
    const profile1 = this.learningLanguages[0].profile;
    const profile2 = this.learningLanguages[1].profile;

    if (!profile1 || !profile2) {
      return new LearningLanguagesMustContainsProfilesForTandem();
    }

    if (profile1.id === profile2.id) {
      throw new InvalidTandemError('Tandem must have two different profiles');
    }
    
    // TODO(discovery): languages spoken should include learning languages
    // if discover for other learning language
    if ((!this.learningLanguages[1].language.isJokerLanguage() && !profile1.isSpeakingLanguage(this.learningLanguages[1].language)) || (
      !this.learningLanguages[0].language.isJokerLanguage() && !profile2.isSpeakingLanguage(this.learningLanguages[0].language)
    )) {
      throw new InvalidTandemError(
        `Learning language and native/mastered language missmatch between profiles ${this.learningLanguages[0].profile.id} and ${this.learningLanguages[1].profile.id}`,
      );
    }
  }
}
