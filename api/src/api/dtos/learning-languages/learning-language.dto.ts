import { ApiProperty } from '@nestjs/swagger';
import {
  JOKER_LANGUAGE_CODE,
  LearningLanguage,
  ProficiencyLevel,
} from 'src/core/models';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LearningLanguageDto {
  @ApiProperty({ type: 'string', example: 'EN' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  constructor(partial: Partial<LearningLanguageDto>) {
    Object.assign(this, partial, {
      code: partial?.code || JOKER_LANGUAGE_CODE,
    });
  }

  static fromDomain(learningLanguage: LearningLanguage): LearningLanguageDto {
    return new LearningLanguageDto({
      code: learningLanguage.language.code,
      level: learningLanguage.level,
    });
  }
}
