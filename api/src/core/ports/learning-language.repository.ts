import { LearningLanguage } from '../models';

export const LEARNING_LANGUAGE_REPOSITORY = 'learning-language.repository';

export interface LearningLanguageRepository {
  ofId: (id: string) => Promise<LearningLanguage | null>;

  getLearningLanguagesOfProfileSpeakingAndNotInActiveTandem: (
    languageId: string,
  ) => Promise<LearningLanguage[]>;

  getLearningLanguagesOfUniversitiesNotInActiveTandem: (
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  hasAnActiveTandem: (id: string) => Promise<boolean>;
}
