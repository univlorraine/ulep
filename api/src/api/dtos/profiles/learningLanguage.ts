import * as Swagger from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LearningLanguage, ProficiencyLevel } from 'src/core/models';

export class LearningLanguageDto {
  @Swagger.ApiProperty({ type: 'string', example: 'EN' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @Swagger.ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  constructor(partial: Partial<LearningLanguageDto>) {
    Object.assign(this, partial);
  }

  static fromDomain(learningLanguage: LearningLanguage): LearningLanguageDto {
    return new LearningLanguageDto({
      code: learningLanguage.language.code,
      level: learningLanguage.level,
    });
  }
}
