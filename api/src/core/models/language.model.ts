import { ProficiencyLevel } from './proficiency.model';

export class Language {
  id: string;
  code: string;
  name?: string;
}

export type LearningLanguage = Language & {
  level: ProficiencyLevel;
};
