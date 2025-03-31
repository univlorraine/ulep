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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { InterestResponse } from 'src/api/dtos/interests';
import { AvailabilitesDto } from 'src/api/dtos/profiles/availabilities';
import { TestedLanguageResponse } from 'src/api/dtos/tested-languages/tested-language.response';
import { Language } from 'src/core/models';
import { MeetingFrequency, Profile } from 'src/core/models/profile.model';
import { LearningLanguageResponse } from '../learning-languages';
import { ObjectiveResponse } from '../objective';
import { UserResponse } from '../users';
import { BiographyDto } from './biography';

class NativeLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiPropertyOptional({ type: 'string', example: 'France' })
  @Expose({ groups: ['read'] })
  name?: string;

  constructor(partial: Partial<Language>) {
    Object.assign(this, partial);
  }
}

class MasteredLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiPropertyOptional({ type: 'string', example: 'France' })
  @Expose({ groups: ['read'] })
  name?: string;

  constructor(partial: Partial<Language>) {
    Object.assign(this, partial);
  }
}

export class ProfileResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  user: UserResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map((val) => new LearningLanguageResponse(val)),
  )
  learningLanguages: LearningLanguageResponse[];

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new NativeLanguageResponse(value))
  nativeLanguage: NativeLanguageResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map(
      (masteredLanguage) => new MasteredLanguageResponse(masteredLanguage),
    ),
  )
  masteredLanguages: MasteredLanguageResponse[];

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map((testedLanguage) => new TestedLanguageResponse(testedLanguage)),
  )
  testedLanguages: TestedLanguageResponse[];

  @ApiProperty({ type: ObjectiveResponse, isArray: true })
  @Expose({ groups: ['read'] })
  objectives: ObjectiveResponse[];

  @ApiProperty({ type: 'string', enum: MeetingFrequency })
  @Expose({ groups: ['read'] })
  meetingFrequency: MeetingFrequency;

  @ApiProperty({ type: () => InterestResponse, isArray: true })
  @Expose({ groups: ['read'] })
  interests: InterestResponse[];

  @ApiProperty({ type: () => AvailabilitesDto })
  @Transform(({ value }) => new AvailabilitesDto(value))
  @Expose({ groups: ['read'] })
  @IsObject()
  @ValidateNested()
  availabilities: AvailabilitesDto;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  @IsBoolean()
  availabilitiesNote: string;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  @IsBoolean()
  availabilitiesNotePrivacy: boolean;

  @ApiProperty({ type: () => BiographyDto, nullable: true })
  @Expose({ groups: ['read'] })
  biography?: BiographyDto;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(profile: Profile, languageCode?: string): ProfileResponse {
    return new ProfileResponse({
      id: profile.id,
      user: UserResponse.fromDomain(profile.user),
      nativeLanguage: {
        name: profile.nativeLanguage.name,
        code: profile.nativeLanguage.code,
      },
      masteredLanguages: profile.masteredLanguages.map((masteredLanguage) => ({
        name: masteredLanguage.name,
        code: masteredLanguage.code,
      })),
      testedLanguages: profile.testedLanguages
        ? profile.testedLanguages.map(TestedLanguageResponse.fromDomain)
        : [],
      learningLanguages: profile.learningLanguages.map((learningLanguage) =>
        LearningLanguageResponse.fromDomain({ learningLanguage }),
      ),
      objectives: profile.objectives.map((objective) =>
        ObjectiveResponse.fromDomain(objective, languageCode),
      ),
      interests: profile.interests.map((interest) =>
        InterestResponse.fromDomain(interest, languageCode),
      ),
      meetingFrequency: profile.meetingFrequency,
      availabilities: AvailabilitesDto.fromDomain(profile.availabilities),
      availabilitiesNote: profile.availabilitiesNote,
      availabilitiesNotePrivacy: profile.availabilitiesNotePrivacy,
      biography:
        profile.biography && BiographyDto.fromDomain(profile.biography),
    });
  }
}
