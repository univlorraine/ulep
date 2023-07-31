import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID, Length } from 'class-validator';
import { Language } from 'src/core/models/language.model';
import { CreateLanguageCommand } from 'src/core/usecases/university';

export class CreateUniversityLanguageRequest implements CreateLanguageCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  university: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsString()
  @Length(2, 2)
  code: string;

  @Swagger.ApiProperty({ type: 'string', example: 'French' })
  @IsString()
  name: string;
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
