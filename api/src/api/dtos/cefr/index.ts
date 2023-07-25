import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CEFRQuestion } from 'src/core/models/cefr';

export class GetCEFRQuestionsResponse {
  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  question: string;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  answer: boolean;

  constructor(partial: Partial<GetCEFRQuestionsResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(question: CEFRQuestion): GetCEFRQuestionsResponse {
    return new GetCEFRQuestionsResponse({
      question: question.value,
      answer: question.answer,
    });
  }
}
