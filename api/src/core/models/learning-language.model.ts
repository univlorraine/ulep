import { Language } from './language.model';
import { ProficiencyLevel } from './proficiency.model';
import { Profile } from './profile.model';

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
