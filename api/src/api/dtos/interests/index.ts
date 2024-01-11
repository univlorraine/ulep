import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Interest, InterestCategory } from 'src/core/models/interest.model';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import { Translation } from 'src/core/models';

export class CreateInterestCategoryRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class CreateInterestRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  category: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class UpdateInterestRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class InterestResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['profile:read'] })
  category: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<InterestResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(interest: Interest, languageCode?: string) {
    const name = textContentTranslationResponse(interest.name, languageCode);
    return new InterestResponse({
      id: interest.id,
      category: interest.category,
      name: name,
    });
  }
}

export class GetInterestResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: TextContentResponse })
  @Expose({ groups: ['read'] })
  name: TextContentResponse;

  constructor(partial: Partial<GetInterestResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(interest: Interest) {
    return new GetInterestResponse({
      id: interest.id,
      name: TextContentResponse.fromDomain(interest.name),
    });
  }
}

export class GetInterestCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: TextContentResponse })
  @Expose({ groups: ['read'] })
  name: TextContentResponse;

  constructor(partial: Partial<GetInterestCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(category: InterestCategory) {
    return new GetInterestResponse({
      id: category.id,
      name: TextContentResponse.fromDomain(category.name),
    });
  }
}

export class InterestCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiPropertyOptional({ type: InterestResponse, isArray: true })
  @Expose({ groups: ['category:read'] })
  interests: InterestResponse[];

  constructor(partial: Partial<InterestCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(category: InterestCategory, languageCode?: string) {
    const name = textContentTranslationResponse(category.name, languageCode);
    return new InterestCategoryResponse({
      id: category.id,
      name: name,
      interests: category.interests?.map((interest) =>
        InterestResponse.fromDomain(interest, languageCode),
      ),
    });
  }
}
