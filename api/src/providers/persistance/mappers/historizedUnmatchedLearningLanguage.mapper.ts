import * as Prisma from '@prisma/client';
import { PurgeSnapshot, purgeMapper } from './purge.mapper';
import { LanguageSnapshot, languageMapper } from './language.mapper';
import { HistorizedUnmatchedLearningLanguage } from 'src/core/models/historized-unmatched-learning-language';

export const HistorizedUnmatchedLearningLanguageRelation = {
  Purge: true,
  Language: true,
};

export type HistorizedUnmatchedLearningLanguageSnapshot =
  Prisma.UnmatchedLearningLanguages & {
    Purge: PurgeSnapshot;
    Language: LanguageSnapshot;
  };

export const historizedUnmatchedLearningLanguageMapper = (
  instance: HistorizedUnmatchedLearningLanguageSnapshot,
): HistorizedUnmatchedLearningLanguage =>
  new HistorizedUnmatchedLearningLanguage({
    id: instance.id,
    userId: instance.user_id,
    purge: purgeMapper(instance.Purge),
    createdAt: instance.created_at,
    language: languageMapper(instance.Language),
  });
