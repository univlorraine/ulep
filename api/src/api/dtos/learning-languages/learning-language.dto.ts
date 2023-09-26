import { ApiProperty } from '@nestjs/swagger';
import {
  JOKER_LANGUAGE_CODE,
  LearningLanguage,
  LearningType,
  ProficiencyLevel,
} from 'src/core/models';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class LearningLanguageDto {
  @ApiProperty({ type: 'string', example: 'EN' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  @ApiProperty({ enum: LearningType })
  @IsEnum(LearningType)
  learningType: LearningType;

  @ApiProperty()
  @IsBoolean()
  sameGender: boolean;

  @ApiProperty()
  @IsBoolean()
  sameAge: boolean;

  @ApiProperty({ type: 'string' })
  @IsUUID()
  @IsOptional()
  campusId?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  certificateOption?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  specificProgram?: boolean;

  constructor(partial: Partial<LearningLanguageDto>) {
    Object.assign(this, partial, {
      code: partial?.code || JOKER_LANGUAGE_CODE,
    });
  }

  static fromDomain(learningLanguage: LearningLanguage): LearningLanguageDto {
    return new LearningLanguageDto({
      code: learningLanguage.language.code,
      level: learningLanguage.level,
      learningType: learningLanguage.learningType,
      sameGender: learningLanguage.sameGender,
      sameAge: learningLanguage.sameAge,
      campusId: learningLanguage.campus?.id,
      certificateOption: learningLanguage.certificateOption,
      specificProgram: learningLanguage.specificProgram,
    });
  }
}
