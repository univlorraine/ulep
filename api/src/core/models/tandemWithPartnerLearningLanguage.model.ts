import {
  learningLanguageMapper,
  LearningLanguageSnapshot,
} from 'src/providers/persistance/mappers/learningLanguage.mapper';
import { LearningLanguage } from './learning-language.model';
import { LearningType } from './profile.model';
import { TandemStatus } from './tandem.model';

export type CreateTandemWithPartnerLearningLanguageProps = {
  id: string;
  learningLanguages: LearningLanguageSnapshot[];
  status: TandemStatus;
  learningType: LearningType;
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
  readonly learningType: LearningType;
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
    this.learningType = props.learningType;
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
