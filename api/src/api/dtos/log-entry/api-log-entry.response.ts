import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProfileWithLogEntries } from 'src/core/models/profileWithLogEntries.model';

import { LearningLanguageWithLogEntriesResponse } from '../learning-languages';
import { ProfileWithLogEntriesResponse } from '../profiles/profiles-with-logentries.response';
import { UserResponse } from '../users';

export class ApiLogEntryResponse extends ProfileWithLogEntriesResponse {
  @Swagger.ApiProperty({ type: LearningLanguageWithLogEntriesResponse })
  @Expose({ groups: ['read'] })
  learningLanguage: LearningLanguageWithLogEntriesResponse;

  constructor(partial: Partial<ApiLogEntryResponse>) {
    super(partial);
    this.learningLanguage = partial.learningLanguage;
  }

  static from(profile: ProfileWithLogEntries): ApiLogEntryResponse {
    return new ApiLogEntryResponse({
      id: profile.id,
      user: UserResponse.fromDomain(profile.user),
      learnings: profile.learningLanguages.map((learningLanguage) =>
        LearningLanguageWithLogEntriesResponse.fromDomain({
          learningLanguage,
        }),
      ),
    });
  }
}
