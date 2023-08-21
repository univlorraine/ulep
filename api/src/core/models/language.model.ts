import { User } from 'src/core/models';
import { ProficiencyLevel } from './proficiency.model';

export type LanguageProps = {
  id: string;
  code: string;
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

  constructor(props: LanguageProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
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

export interface LearningLanguage {
  language: Language;
  level: ProficiencyLevel;
}

export const JOKER_LANGUAGE_CODE = '*';
