/* eslint-disable prettier/prettier */
import { InvalidTandemError, LearningLanguagesMustContainsProfilesForTandem } from '../errors/tandem-exceptions';
import { LearningLanguage } from './learning-language.model';

export enum TandemStatus {
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  VALIDATED_BY_ONE_UNIVERSITY = 'VALIDATED_BY_ONE_UNIVERSITY',
  ACTIVE = 'ACTIVE',
}

export type CreateTandemProps = {
  id: string;
  learningLanguages?: LearningLanguage[];
  status: TandemStatus;
  universityValidations?: string[];
  compatibilityScore: number;
};

export class Tandem {
  readonly id: string;

  // Learning languages that compose the tandem
  readonly learningLanguages?: LearningLanguage[];
  
  // Status of the tandem
  readonly status: TandemStatus;
  
  // ID of universities which has validated the tandem
  readonly universityValidations?: string[];
  
  // Score representing compatibility of learning languages
  readonly compatibilityScore: number;

  constructor(props: CreateTandemProps) {
    this.id = props.id;
    this.status = props.status;
    this.universityValidations = props.universityValidations || [];
    this.compatibilityScore = props.compatibilityScore;
    
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
    
    if (!this.learningLanguages[0].isCompatibleWithLearningLanguage(this.learningLanguages[1])) {
      throw new InvalidTandemError(`learningLanguage ${this.learningLanguages[0].id} doesn't match learningLanguages ${this.learningLanguages[1].id} languages`);
    }
    if (!this.learningLanguages[1].isCompatibleWithLearningLanguage(this.learningLanguages[0])) {
      throw new InvalidTandemError(`learningLanguage ${this.learningLanguages[1].id} doesn't match learningLanguages ${this.learningLanguages[0].id} languages`);
    }
  }

  getHash(): string {
    return this.learningLanguages?.length > 0 ?
      this.learningLanguages
        .map((ll) => ll.id)
        .sort((a, b) => a.localeCompare(b))
        .join('_')
      : "";
  }
}
