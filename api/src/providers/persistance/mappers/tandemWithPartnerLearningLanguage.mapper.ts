import { TandemStatus } from 'src/core/models';
import {
  LearningLanguageRelations,
  LearningLanguageSnapshot,
} from './learningLanguage.mapper';
import * as Prisma from '@prisma/client';
import { TandemWithPartnerLearningLanguage } from 'src/core/models/tandemWithPartnerLearningLanguage.model';

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

export const tandemWithPartnerLearningLanguageMapper = (
  instance: TandemSnapshot,
  rootProfileId: string,
): TandemWithPartnerLearningLanguage => {
  return new TandemWithPartnerLearningLanguage({
    id: instance.id,
    learningLanguages: instance.LearningLanguages,
    status: TandemStatus[instance.status],
    universityValidations:
      instance.UniversityValidations?.map((university) => university.id) || [],
    compatibilityScore: instance.compatibilityScore / 100,
    createdAt: instance.created_at,
    updatedAt: instance.updated_at,
    rootProfileId,
  });
};
