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

import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  LearningLanguageWithTandemWithPartnerLearningLanguage,
  LearningType,
} from 'src/core/models';
import { CampusResponse } from '../campus';
import { MediaObjectResponse } from '../medias';
import { CustomLearningGoalResponse } from '../objective';
import { ProfileResponse } from '../profiles';
import { TandemResponse } from '../tandems';
import { TandemWithPartnerLearningLanguageResponse } from '../tandems/tandem-with-patner-learning-language.response';
import { LanguageResponse } from './../languages/index';

interface LearningLanguageResponseProps {
  learningLanguage: LearningLanguage;
  languageCode?: string;
  countVocabularies?: number;
  countActivities?: number;
}
export class LearningLanguageResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  name?: string;

  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code?: string;

  @ApiProperty({ type: 'string', example: 'A1' })
  @Expose({ groups: ['read'] })
  level: string;

  @ApiProperty({ type: () => () => ProfileResponse })
  @Expose({ groups: ['learning-language:profile'] })
  profile: ProfileResponse;

  @ApiProperty({ type: 'date' })
  @Optional()
  @Expose({ groups: ['read'] })
  createdAt?: Date;

  @ApiProperty({ type: () => () => CampusResponse, nullable: true })
  @Expose({ groups: ['read'] })
  campus: CampusResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  certificateOption: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  learningJournal: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  consultingInterview: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sharedCertificate: boolean;

  @ApiProperty({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  certificateFile: MediaObjectResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  specificProgram: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sameGender: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sameAge: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  hasPriority: boolean;

  @ApiProperty({ type: 'string', example: 'john@example.com' })
  @Expose({ groups: ['read'] })
  sameTandemEmail?: string;

  @ApiProperty({ type: 'string', enum: LearningType })
  @Expose({ groups: ['read'] })
  learningType: LearningType;

  @ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  tandemLanguage?: LanguageResponse;

  @ApiProperty({ type: () => CustomLearningGoalResponse })
  @Expose({ groups: ['read'] })
  customLearningGoals?: CustomLearningGoalResponse[];

  @ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  sharedLogsDate?: Date;

  @ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  sharedLogsForResearchDate?: Date;

  @ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  visioDuration?: number;

  @ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  countVocabularies?: number;

  @ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  countActivities?: number;

  constructor(partial: Partial<LearningLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain({
    learningLanguage,
    languageCode,
    countVocabularies,
    countActivities,
  }: LearningLanguageResponseProps): LearningLanguageResponse {
    const response = new LearningLanguageResponse({
      id: learningLanguage.id,
      name: learningLanguage.language.name,
      code: learningLanguage.language.code,
      level: learningLanguage.level,
      createdAt: learningLanguage.createdAt,
      campus:
        learningLanguage.campus &&
        CampusResponse.fromCampus(learningLanguage.campus),
      certificateOption: learningLanguage.certificateOption,
      learningJournal: learningLanguage.learningJournal,
      consultingInterview: learningLanguage.consultingInterview,
      sharedCertificate: learningLanguage.sharedCertificate,
      certificateFile:
        learningLanguage.certificateFile &&
        MediaObjectResponse.fromMediaObject(learningLanguage.certificateFile),
      specificProgram: learningLanguage.specificProgram,
      learningType: learningLanguage.learningType,
      sameGender: learningLanguage.sameGender,
      sameAge: learningLanguage.sameAge,
      hasPriority: learningLanguage.hasPriority,
      sameTandemEmail: learningLanguage.sameTandemEmail,
      sharedLogsDate: learningLanguage.sharedLogsDate,
      sharedLogsForResearchDate: learningLanguage.sharedLogsForResearchDate,
      tandemLanguage:
        learningLanguage.tandemLanguage &&
        LanguageResponse.fromLanguage(learningLanguage.tandemLanguage),
      profile:
        learningLanguage.profile &&
        ProfileResponse.fromDomain(learningLanguage.profile, languageCode),
      customLearningGoals:
        learningLanguage.customLearningGoals &&
        learningLanguage.customLearningGoals.map((customLearningGoal) =>
          CustomLearningGoalResponse.fromDomain(customLearningGoal),
        ),
      visioDuration: learningLanguage.visioDuration,
      countVocabularies: countVocabularies,
      countActivities: countActivities,
    });

    return response;
  }
}

interface LearningLanguageWithTandemResponseProps {
  learningLanguage: LearningLanguageWithTandem;
}

export class LearningLanguageWithTandemResponse extends LearningLanguageResponse {
  @ApiProperty({ type: () => TandemResponse })
  @Expose({ groups: ['read'] })
  @Optional()
  tandem?: TandemResponse;

  constructor(partial: Partial<LearningLanguageWithTandemResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromDomain({
    learningLanguage,
  }: LearningLanguageWithTandemResponseProps): LearningLanguageWithTandemResponse {
    return new LearningLanguageWithTandemResponse({
      ...LearningLanguageResponse.fromDomain({ learningLanguage }),
      tandem:
        learningLanguage.tandem &&
        TandemResponse.fromDomain(learningLanguage.tandem),
    });
  }
}

interface LearningLanguageWithTandemsProfilesResponseProps {
  learningLanguage: LearningLanguageWithTandemWithPartnerLearningLanguage;
}

export class LearningLanguageWithTandemsProfilesResponse extends LearningLanguageResponse {
  @ApiProperty({ type: () => TandemWithPartnerLearningLanguageResponse })
  @Expose({ groups: ['read'] })
  tandem?: TandemWithPartnerLearningLanguageResponse;

  constructor(partial: Partial<LearningLanguageWithTandemsProfilesResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromDomain({
    learningLanguage,
  }: LearningLanguageWithTandemsProfilesResponseProps): LearningLanguageWithTandemsProfilesResponse {
    return new LearningLanguageWithTandemsProfilesResponse({
      ...LearningLanguageResponse.fromDomain({ learningLanguage }),
      tandem:
        learningLanguage.tandem &&
        TandemWithPartnerLearningLanguageResponse.fromDomain(
          learningLanguage.tandem,
        ),
    });
  }
}
