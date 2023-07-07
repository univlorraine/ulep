import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Match } from 'src/core/models/match';
import { ProfileResponse } from '../profiles/profile.response';

export class MatchResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Type(() => ProfileResponse)
  profile: ProfileResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  score: number;

  constructor(partial: Partial<MatchResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Match): MatchResponse {
    return new MatchResponse({
      profile: ProfileResponse.fromDomain(instance.target),
      score: instance.score,
    });
  }
}
