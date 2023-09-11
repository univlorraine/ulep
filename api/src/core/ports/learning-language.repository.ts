import { Collection } from '@app/common';
import { LearningLanguage, LearningLanguageWithTandem } from '../models';

export const LEARNING_LANGUAGE_REPOSITORY = 'learning-language.repository';

export interface LearningLanguageRepositoryGetProps {
  page: number;
  limit: number;
  universityIds: string[];
}

export interface LearningLanguageRepository {
  ofId: (id: string) => Promise<LearningLanguage | null>;

  create: (learningLanguage: LearningLanguage) => Promise<void>;

  getLearningLanguagesOfProfileSpeakingAndNotInActiveTandemFromUniversities: (
    languageId: string,
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getLearningLanguagesOfUniversitiesNotInActiveTandem: (
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getLearningLanguagesOfOtherProfileFromUniversitiesNotInActiveTandem: (
    profileId: string,
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  hasAnActiveTandem: (id: string) => Promise<boolean>;

  OfUniversities: (
    props: LearningLanguageRepositoryGetProps,
  ) => Promise<Collection<LearningLanguageWithTandem>>;
}
