import { Collection, SortOrder } from '@app/common';
import { LearningLanguage, LearningLanguageWithTandem } from '../models';
import { HistorizedUnmatchedLearningLanguage } from 'src/core/models/historized-unmatched-learning-language';

export const LEARNING_LANGUAGE_REPOSITORY = 'learning-language.repository';

export enum LearningLanguageQuerySortKey {
  PROFILE = 'profile',
  UNIVERSITY = 'university',
  LANGUAGE = 'language',
  LEVEL = 'level',
  CREATED_AT = 'createdAt',
  SPECIFIC_PROGRAM = 'specificProgram',
  ROLE = 'role',
}

export interface LearningLanguageRepositoryGetProps {
  page: number;
  limit: number;
  universityIds: string[];
  hasActiveTandem?: boolean;
  hasActionableTandem?: boolean;
  hasPausedTandem?: boolean;
  lastname?: string;
  orderBy?: {
    field: LearningLanguageQuerySortKey;
    order: SortOrder;
  };
}

export interface LearningLanguageRepository {
  ofId: (id: string) => Promise<LearningLanguage | null>;

  ofProfile: (id: string) => Promise<LearningLanguage[]>;

  create: (learningLanguage: LearningLanguage) => Promise<void>;

  getAvailableLearningLanguagesSpeakingLanguageFromUniversities: (
    languageId: string,
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getAvailableLearningLanguagesOfUniversities: (
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getAvailableLearningLanguagesSpeakingOneOfLanguagesAndFromUniversities: (
    allowedLanguages: string[],
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getUnmatchedLearningLanguages: () => Promise<LearningLanguage[]>;

  hasAnActiveTandem: (id: string) => Promise<boolean>;

  OfUniversities: (
    props: LearningLanguageRepositoryGetProps,
  ) => Promise<Collection<LearningLanguageWithTandem>>;

  delete(id: string): Promise<void>;

  update(learningLanguage: LearningLanguage): Promise<void>;

  archiveUnmatchedLearningLanguages(
    learningLanguages: LearningLanguage[],
    purgeId: string,
  ): Promise<void>;

  getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedUnmatchedLearningLanguage>;
}
