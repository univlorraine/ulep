import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, Length } from 'class-validator';
import {
  CreateInterestCategoryCommand,
  CreateInterestCommand,
} from '../../../core/usecases/interest';
import { Interest, InterestCategory } from 'src/core/models/interest.model';

export class CreateInterestCategoryRequest
  implements CreateInterestCategoryCommand
{
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  // TODO: get the language code from the request headers
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsString()
  @Length(2, 2)
  languageCode: string;
}

export class CreateInterestRequest implements CreateInterestCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  category: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  // TODO: get the language code from the request headers
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsString()
  @Length(2, 2)
  languageCode: string;
}

export class InterestCategoryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiPropertyOptional({ isArray: true })
  @Expose({ groups: ['category:read'] })
  interests: InterestResponse[];

  constructor(partial: Partial<InterestCategoryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(category: InterestCategory) {
    return new InterestCategoryResponse({
      id: category.id,
      name: category.name.content,
      interests: category.interests?.map(InterestResponse.fromDomain),
    });
  }
}

export class InterestResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<InterestResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(interest: Interest) {
    return new InterestResponse({
      id: interest.id,
      name: interest.name.content,
    });
  }
}
