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
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CountryCode, CountryWithUniversities } from 'src/core/models';
import { PaginationDto } from '../pagination';
import { UpdateCountryStatusCommand } from 'src/core/usecases';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '@app/common';
import { UniversityResponse } from 'src/api/dtos/universities';

export class UpdateCountryRequest
  implements Omit<UpdateCountryStatusCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'boolean' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  enable: boolean;
}

export class CountryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @Swagger.ApiProperty({ type: 'string', example: 'France' })
  @Expose({ groups: ['read', 'country:read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string', example: '🇫🇷' })
  @Expose({ groups: ['read', 'country:read'] })
  emoji: string;

  @Swagger.ApiProperty({ type: 'boolean', example: true })
  @Expose({ groups: ['read', 'country:read'] })
  enable: boolean;

  constructor(partial: Partial<CountryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(country: CountryCode): CountryResponse {
    return new CountryResponse({ ...country });
  }
}

export class CountryUniversitiesResponse extends CountryResponse {
  @Swagger.ApiProperty({ type: UniversityResponse, isArray: true })
  @Expose({ groups: ['read'] })
  universities: UniversityResponse[];

  constructor(partial: Partial<CountryUniversitiesResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromDomain(
    countryUniversities: CountryWithUniversities,
  ): CountryUniversitiesResponse {
    return new CountryUniversitiesResponse({
      ...countryUniversities,
      universities: countryUniversities.universities.map((university) =>
        UniversityResponse.fromUniversity(university),
      ),
    });
  }
}

export class GetCountriesQueryParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ default: true })
  @Transform(({ value }) => (value ? value === 'true' : true))
  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  field?: string;

  @Swagger.ApiPropertyOptional({ default: true })
  @Transform(({ value }) => (value ? value === 'true' : true))
  @IsBoolean()
  @IsOptional()
  pagination?: boolean;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
