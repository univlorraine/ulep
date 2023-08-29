import * as Swagger from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { LanguageStatus } from 'src/core/models';
import { LanguageFilter } from 'src/core/ports/language.repository';

export class FindAllLanguageParams {
  @Swagger.ApiProperty({
    type: 'string',
    enum: [LanguageStatus, 'PARTNER'],
  })
  @IsOptional()
  status?: LanguageFilter;
}
