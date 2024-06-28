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
  UniversityValidations: true,
};

export type TandemSnapshot = Prisma.Tandems & {
  LearningLanguages?: LearningLanguageSnapshot[];
  UniversityValidations?: Prisma.Organizations[];
};

export const tandemMapper = (instance: TandemSnapshot): Tandem => {
  return new Tandem({
    id: instance.id,
    learningLanguages: instance.LearningLanguages?.map(learningLanguageMapper),
    status: TandemStatus[instance.status],
    universityValidations:
      instance.UniversityValidations?.map((university) => university.id) || [],
    compatibilityScore: instance.compatibilityScore / 100,
    createdAt: instance.created_at,
  });
};
