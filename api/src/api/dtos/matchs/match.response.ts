import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Match } from 'src/core/models/matchs.model';
import { LearningLanguageResponse } from '../learning-languages';
import { LanguageResponse } from '../languages';

class MatchScoreDto {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  level: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  age: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  status: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  goals: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  interests: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  meetingFrequency: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  certificateOption: number;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  total: number;

  constructor(partial: Partial<MatchScoreDto>) {
    Object.assign(this, partial);
  }
}

export class MatchResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Type(() => LearningLanguageResponse)
  target: LearningLanguageResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  score: MatchScoreDto;

  @ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  tandemLanguage?: LanguageResponse;

  constructor(partial: Partial<MatchResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Match): MatchResponse {
    return new MatchResponse({
      target: LearningLanguageResponse.fromDomain(instance.target),
      score: new MatchScoreDto({
        level: instance.scores.level,
        age: instance.scores.age,
        status: instance.scores.status,
        goals: instance.scores.goals,
        interests: instance.scores.interests,
        meetingFrequency: instance.scores.meetingFrequency,
        certificateOption: instance.scores.certificateOption,
        total: instance.total,
      }),
      tandemLanguage:
        instance.owner.tandemLanguage &&
        LanguageResponse.fromLanguage(instance.owner.tandemLanguage),
    });
  }
}
