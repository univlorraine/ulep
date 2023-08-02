import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { Language } from 'src/core/models/language.model';
import { AddLanguageCommand } from 'src/core/usecases/university';

export class AddUniversityLanguageRequest
  implements Omit<AddLanguageCommand, 'university'>
{
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  language: string;
}

export class LanguageResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @Swagger.ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  name?: string;

  constructor(partial: Partial<LanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromLanguage(language: Language) {
    return new LanguageResponse({
      id: language.id,
      code: language.code,
      name: language.name,
    });
  }
}
