import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { MediaObjectResponse } from 'src/api/dtos/medias';
import {
  TextContentResponse,
  textContentTranslationResponse,
} from 'src/api/dtos/text-content';
import { LearningObjective, Translation } from 'src/core/models';

export class CreateObjectiveRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}

export class UpdateObjectiveRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  @IsNotEmpty()
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

export class GetObjectiveResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiPropertyOptional({ type: MediaObjectResponse })
  @Expose({ groups: ['read'] })
  image?: MediaObjectResponse;

  @Swagger.ApiProperty({ type: TextContentResponse })
  @Expose({ groups: ['read'] })
  name: TextContentResponse;

  constructor(partial: Partial<GetObjectiveResponse>) {
    Object.assign(this, partial);
  }
  static fromDomain(instance: LearningObjective) {
    return new GetObjectiveResponse({
      id: instance.id,
      image: instance.image
        ? MediaObjectResponse.fromMediaObject(instance.image)
        : null,
      name: TextContentResponse.fromDomain(instance.name),
    });
  }
}

export class ObjectiveResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiPropertyOptional({ type: MediaObjectResponse })
  @Expose({ groups: ['read'] })
  image?: MediaObjectResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<ObjectiveResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: LearningObjective, languageCode?: string) {
    const name = textContentTranslationResponse({
      textContent: instance.name,
      languageCode,
    });

    return new ObjectiveResponse({
      id: instance.id,
      image: instance.image
        ? MediaObjectResponse.fromMediaObject(instance.image)
        : null,
      name,
    });
  }
}
