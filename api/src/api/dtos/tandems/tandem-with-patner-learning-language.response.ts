import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LearningType } from 'src/core/models';
import { TandemWithPartnerLearningLanguage } from 'src/core/models/tandemWithPartnerLearningLanguage.model';
import { TandemStatus } from '../../../core/models/tandem.model';
import { LearningLanguageResponse } from '../learning-languages';

export class TandemWithPartnerLearningLanguageResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  partnerLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: 'string', enum: LearningType })
  @Expose({ groups: ['read'] })
  learningType: LearningType;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  compatibilityScore: number;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['tandem:university-validations'] })
  universityValidations?: string[];

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  updatedAt?: Date;

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  createdAt?: Date;

  constructor(partial: Partial<TandemWithPartnerLearningLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    tandem: TandemWithPartnerLearningLanguage,
  ): TandemWithPartnerLearningLanguageResponse {
    return new TandemWithPartnerLearningLanguageResponse({
      id: tandem.id,
      partnerLearningLanguage: LearningLanguageResponse.fromDomain({
        learningLanguage: tandem.partnerLearningLanguage,
      }),
      status: tandem.status,
      learningType: tandem.learningType,
      compatibilityScore: tandem.compatibilityScore,
      universityValidations: tandem.universityValidations,
      createdAt: tandem.createdAt,
      updatedAt: tandem.updatedAt,
    });
  }
}
