import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { Edito } from 'src/core/models/edito.model';
import { EventTranslation } from 'src/core/models/event.model';
import { UniversityResponse } from '../universities';

export class EditoTranslationResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<EditoTranslationResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: EventTranslation) {
    return new EditoTranslationResponse({
      languageCode: instance.languageCode,
      content: instance.content,
    });
  }
}

export class EditoResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: [EditoTranslationResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  translations: EditoTranslationResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  university: UniversityResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  imageURL?: string;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  updatedAt: Date;

  constructor(partial: Partial<EditoResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Edito) {
    return new EditoResponse({
      id: instance.id,
      content: instance.content,
      university: UniversityResponse.fromUniversity(instance.university),
      imageURL: instance.imageURL,
      languageCode: instance.languageCode,
      translations: instance.translations.map(
        EditoTranslationResponse.fromDomain,
      ),
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    });
  }
}
