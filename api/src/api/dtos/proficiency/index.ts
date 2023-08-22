import * as Swagger from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  Length,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { textContentTranslationResponse } from 'src/api/dtos/text-content';
import { Translation } from 'src/core/models';
import {
  ProficiencyLevel,
  ProficiencyQuestion,
  ProficiencyTest,
} from 'src/core/models/proficiency.model';
import {
  CreateQuestionCommand,
  CreateTestCommand,
} from 'src/core/usecases/proficiency';

export class CreateTestRequest implements CreateTestCommand {
  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;
}

export class CreateQuestionRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  test: string;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @Transform(({ value }) => value ?? true)
  @IsBoolean()
  answer = true;
}

export class ProficiencyQuestionResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @Expose({ groups: ['read'] })
  value: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  answer: boolean;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @Expose({ groups: ['read'] })
  level: ProficiencyLevel;

  constructor(partial: Partial<ProficiencyQuestionResponse>) {
    Object.assign(this, partial);
  }

  static fromProficiencyQuestion(
    question: ProficiencyQuestion,
    languageCode?: string,
  ): ProficiencyQuestionResponse {
    const name = textContentTranslationResponse(question.text, languageCode);
    return new ProficiencyQuestionResponse({
      id: question.id,
      value: name,
      answer: question.answer,
      level: question.level,
    });
  }
}

export class ProficiencyTestResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @Expose({ groups: ['read'] })
  level: ProficiencyLevel;

  @Swagger.ApiProperty({ type: ProficiencyQuestionResponse, isArray: true })
  @Expose({ groups: ['test:read'] })
  questions: ProficiencyQuestionResponse[];

  constructor(partial: Partial<ProficiencyTestResponse>) {
    Object.assign(this, partial);
  }

  static fromProficiencyTest(
    test: ProficiencyTest,
    languageCode?: string,
  ): ProficiencyTestResponse {
    return new ProficiencyTestResponse({
      id: test.id,
      level: test.level,
      questions: (test.questions ?? []).map((question) =>
        ProficiencyQuestionResponse.fromProficiencyQuestion(
          question,
          languageCode,
        ),
      ),
    });
  }
}
