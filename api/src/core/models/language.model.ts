import { Profile, User } from 'src/core/models';
import { ProficiencyLevel } from './proficiency.model';

export enum LanguageStatus {
  PRIMARY = 'PRIMARY',
  UNACTIVE = 'UNACTIVE',
  SECONDARY = 'SECONDARY',
}

export type LanguageProps = {
  id: string;
  code: string;
  mainUniversityStatus: LanguageStatus;
  secondaryUniversityActive: boolean;
  name?: string;
};

export type SuggestedLanguageProps = {
  id: string;
  language: Language;
  user: User;
};

export class Language {
  readonly id: string;
  readonly code: string;
  readonly name?: string;
  readonly mainUniversityStatus: LanguageStatus;
  readonly secondaryUniversityActive: boolean;

  constructor(props: LanguageProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.mainUniversityStatus = props.mainUniversityStatus;
    this.secondaryUniversityActive = props.secondaryUniversityActive;
  }

  public isJokerLanguage() {
    return this.code === JOKER_LANGUAGE_CODE;
  }
}

export class SuggestedLanguage {
  readonly id: string;
  readonly language: Language;
  readonly user: User;

  constructor(props: SuggestedLanguageProps) {
    this.id = props.id;
    this.language = props.language;
    this.user = props.user;
  }
}

// TODO(NOW+1): move in separate file (or profile file)
// TODO(NOW+2): rename model ?
export class LearningLanguage {
  readonly id: string;
  readonly language: Language;
  readonly level: ProficiencyLevel;
  readonly profile?: Profile;

  constructor({
    id,
    language,
    level,
    profile,
  }: {
    id: string;
    language: Language;
    level: ProficiencyLevel;
    profile?: Profile;
  }) {
    this.id = id;
    this.language = language;
    this.level = level;
    this.profile = profile;
  }
}

export const JOKER_LANGUAGE_CODE = '*';
