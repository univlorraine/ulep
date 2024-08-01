import {
  learningLanguageMapper,
  LearningLanguageSnapshot,
} from 'src/providers/persistance/mappers/learningLanguage.mapper';
import { LearningLanguage } from './learning-language.model';

export enum TandemStatus {
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  VALIDATED_BY_ONE_UNIVERSITY = 'VALIDATED_BY_ONE_UNIVERSITY',
  PAUSED = 'PAUSED',
  ACTIVE = 'ACTIVE',
}

export type CreateTandemWithPartnerLearningLanguageProps = {
  id: string;
  learningLanguages: LearningLanguageSnapshot[];
  status: TandemStatus;
  universityValidations?: string[];
  compatibilityScore: number;
  createdAt?: Date;
  updatedAt?: Date;
  rootProfileId: string;
};

export class TandemWithPartnerLearningLanguage {
  readonly id: string;
  readonly partnerLearningLanguage: LearningLanguage;
  readonly status: TandemStatus;
  readonly universityValidations?: string[];
  readonly compatibilityScore: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: CreateTandemWithPartnerLearningLanguageProps) {
    this.id = props.id;
    this.status = props.status;
    this.partnerLearningLanguage = learningLanguageMapper(
      this.getPartnerLearningLanguage(
        props.learningLanguages,
        props.rootProfileId,
      ),
    );
    this.universityValidations = props.universityValidations || [];
    this.compatibilityScore = props.compatibilityScore;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: CreateTandemWithPartnerLearningLanguageProps,
  ): TandemWithPartnerLearningLanguage {
    return new TandemWithPartnerLearningLanguage(props);
  }

  private getPartnerLearningLanguage(
    learningLanguages: LearningLanguageSnapshot[],
    profileId: string,
  ): LearningLanguageSnapshot {
    return learningLanguages.find((ll) => ll.Profile.id !== profileId);
  }
}
