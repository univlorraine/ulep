import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateActivityExerciseRequest } from 'src/api/dtos/activity/create-activity.request';
import { ProficiencyLevel } from 'src/core/models';
import { ActivityStatus } from 'src/core/models/activity.model';

class UpdateActivityVocabularyRequest {
  @ApiProperty({ type: 'string' })
  @IsOptional()
  id?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  content?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  pronunciationUrl?: string;
}

export class UpdateActivityRequest {
  @ApiProperty({ type: 'string' })
  @IsOptional()
  title?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', enum: ActivityStatus })
  @IsOptional()
  status?: ActivityStatus;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  languageLevel?: ProficiencyLevel;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  languageCode?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  themeId?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  ressourceUrl?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  creditImage?: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsOptional()
  exercises: CreateActivityExerciseRequest[];

  @ApiProperty({ type: 'string', isArray: true })
  @IsOptional()
  vocabularies: UpdateActivityVocabularyRequest[];
}
