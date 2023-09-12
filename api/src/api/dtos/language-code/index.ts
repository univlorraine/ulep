import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { UserResponse } from 'src/api/dtos/users';
import { Language, LanguageStatus, SuggestedLanguage } from 'src/core/models';

export class LanguageCodeResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<LanguageCodeResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Language): LanguageCodeResponse {
    return new LanguageCodeResponse({
      id: instance.id,
      code: instance.code,
      name: instance.name,
    });
  }
}

export class LanguageRequestsCountResponse {
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  count: number;

  constructor(partial: Partial<LanguageRequestsCountResponse>) {
    Object.assign(this, partial);
  }
}

export class SuggestedLanguageResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: LanguageCodeResponse })
  @Expose({ groups: ['read'] })
  language: LanguageCodeResponse;

  @Swagger.ApiProperty({ type: UserResponse })
  @Expose({ groups: ['read'] })
  user: UserResponse;

  constructor(partial: Partial<SuggestedLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: SuggestedLanguage): SuggestedLanguageResponse {
    return new SuggestedLanguageResponse({
      id: instance.id,
      language: LanguageCodeResponse.fromDomain(instance.language),
      user: UserResponse.fromDomain(instance.user),
    });
  }
}

export class AllSuggestedLanguageCountResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: LanguageCodeResponse })
  @Expose({ groups: ['read'] })
  language: LanguageCodeResponse;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  count: number;

  constructor(partial: Partial<AllSuggestedLanguageCountResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: {
    language: Language;
    count: number;
  }): AllSuggestedLanguageCountResponse {
    return new AllSuggestedLanguageCountResponse({
      id: instance.language.id,
      language: LanguageCodeResponse.fromDomain(instance.language),
      count: instance.count,
    });
  }
}

export class UpdateLanguageCodeRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @Swagger.ApiProperty({ type: 'string', enum: LanguageStatus })
  @IsString()
  @IsOptional()
  mainUniversityStatus: LanguageStatus;

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  secondaryUniversityActive?: boolean;
}
