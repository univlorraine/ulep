/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LearningLanguage, LearningType } from 'src/core/models';
import { Tandem, TandemStatus } from '../../../core/models/tandem.model';
import { LearningLanguageResponse } from '../learning-languages';

export class TandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  learningLanguages: LearningLanguageResponse[];

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

  constructor(partial: Partial<TandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(tandem: Tandem): TandemResponse {
    return new TandemResponse({
      id: tandem.id,
      learningLanguages:
        tandem.learningLanguages?.map((learningLanguage) =>
          LearningLanguageResponse.fromDomain({ learningLanguage }),
        ) || [],
      status: tandem.status,
      learningType: tandem.learningType,
      compatibilityScore: tandem.compatibilityScore,
      universityValidations: tandem.universityValidations,
      createdAt: tandem.createdAt,
      updatedAt: tandem.updatedAt,
    });
  }
}

export class UserTandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  partnerLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  userLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['read'] })
  universityValidations: string[];

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  compatibilityScore: number;

  constructor(partial: Partial<UserTandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    profileId: string,
    tandem: Tandem,
    languageCode?: string,
    countVocabularies?: number,
    countActivities?: number,
  ): UserTandemResponse {
    const { learningLanguageProfile, learningLanguagePartner } =
      tandem.learningLanguages.reduce<{
        learningLanguageProfile: LearningLanguage;
        learningLanguagePartner: LearningLanguage;
      }>(
        (accumulator, value) => {
          if (value.profile.id !== profileId) {
            accumulator.learningLanguagePartner = value;
          } else {
            accumulator.learningLanguageProfile = value;
          }
          return accumulator;
        },
        {
          learningLanguageProfile: null,
          learningLanguagePartner: null,
        },
      );

    if (!learningLanguagePartner.profile) {
      throw new Error('Partner not found');
    }

    return new UserTandemResponse({
      id: tandem.id,
      partnerLearningLanguage: LearningLanguageResponse.fromDomain({
        learningLanguage: learningLanguagePartner,
        languageCode,
      }),
      status: tandem.status,
      userLearningLanguage: LearningLanguageResponse.fromDomain({
        learningLanguage: learningLanguageProfile,
        countVocabularies: countVocabularies,
        countActivities: countActivities,
      }),

      universityValidations: tandem.universityValidations,
      compatibilityScore: tandem.compatibilityScore,
    });
  }
}
