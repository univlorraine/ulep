import * as Swagger from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  Length,
  IsBoolean,
} from 'class-validator';
import { textContentTranslationResponse } from 'src/api/dtos/text-content';
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

export class CreateQuestionRequest implements CreateQuestionCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  test: string;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  // TODO: get the language code from the request headers
  @Swagger.ApiProperty({ type: 'string' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsString()
  @Length(2, 2)
  languageCode: string;

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
