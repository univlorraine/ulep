import { Tandem, TandemStatus } from 'src/core/models';
import {
  LearningLanguageRelations,
  LearningLanguageSnapshot,
  learningLanguageMapper,
} from './learningLanguage.mapper';
import * as Prisma from '@prisma/client';

export const TandemRelations = {
  LearningLanguages: {
    include: LearningLanguageRelations,
  },
};

export type TandemSnapshot = Prisma.Tandems & {
  LearningLanguages: LearningLanguageSnapshot[];
};

export const tandemMapper = (instance: TandemSnapshot): Tandem =>
  new Tandem({
    id: instance.id,
    learningLanguages: instance.LearningLanguages.map(learningLanguageMapper),
    status: TandemStatus[instance.status],
  });
