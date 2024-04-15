import { Language } from 'src/core/models/language.model';
import { ProficiencyLevel } from 'src/core/models/proficiency.model';

export type TestedLanguageProps = {
  language: Language;
  level: ProficiencyLevel;
};

export class TestedLanguage {
  readonly language: Language;
  readonly level: ProficiencyLevel;

  constructor(data: TestedLanguageProps) {
    this.language = data.language;
    this.level = data.level;
  }
}
