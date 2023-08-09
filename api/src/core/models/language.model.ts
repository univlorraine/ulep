import { ProficiencyLevel } from './proficiency.model';

export type LanguageProps = {
  id: string;
  code: string;
  name?: string;
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

export interface LearningLanguage {
  language: Language;
  level: ProficiencyLevel;
}

export const JOKER_LANGUAGE_CODE = '*';
