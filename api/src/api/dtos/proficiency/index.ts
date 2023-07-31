import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, IsEnum, Length } from 'class-validator';
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

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @IsUUID()
  test: string;

  @Swagger.ApiProperty({ type: 'string', uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  // TODO: get the language code from the request headers
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @Length(2, 2)
  languageCode: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsNotEmpty()
  answer: boolean;
}

export class ProficiencyTestResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', enum: ProficiencyLevel })
  @Expose({ groups: ['read'] })
  level: ProficiencyLevel;

  @Swagger.ApiProperty({ isArray: true })
  @Expose({ groups: ['test:read'] })
  questions: ProficiencyQuestionResponse[];

  constructor(partial: Partial<ProficiencyTestResponse>) {
    Object.assign(this, partial);
  }

  static fromProficiencyTest(test: ProficiencyTest): ProficiencyTestResponse {
    return new ProficiencyTestResponse({
      id: test.id,
      level: test.level,
      questions: test.questions.map(
        ProficiencyQuestionResponse.fromProficiencyQuestion,
      ),
    });
  }
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

  // TODO: add languageCode parameter
  static fromProficiencyQuestion(
    question: ProficiencyQuestion,
  ): ProficiencyQuestionResponse {
    return new ProficiencyQuestionResponse({
      id: question.id,
      value: question.text.content,
      answer: question.answer,
    });
  }
}
