import * as Swagger from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProficiencyLevel } from 'src/core/models';

export class TestedLanguageProps {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsString()
  code: string;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;
}
