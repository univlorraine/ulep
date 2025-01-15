import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ProficiencyLevel } from 'src/core/models';

export class CreateActivityExerciseRequest {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  order: number;
}

export class CreateActivityRequest {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  languageLevel: ProficiencyLevel;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  themeId: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  ressourceUrl?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  creditImage?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  profileId?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  universityId?: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsNotEmpty()
  exercises: CreateActivityExerciseRequest[];

  @ApiProperty({ type: 'string', isArray: true })
  @IsOptional()
  vocabularies?: string[];
}
