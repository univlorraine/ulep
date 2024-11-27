import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';

export type GetAllEntriesForUserGroupedByDatesCommand = {
  id: string;
  ownerId: string;
  page: number;
  limit: number;
};

@Injectable()
export class GetAllEntriesForUserGroupedByDatesUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetAllEntriesForUserGroupedByDatesCommand) {
    await this.assertProfileExists(command.ownerId);

    return this.logEntryRepository.findAllForUserIdGroupedByDates(
      command.ownerId,
      command.page,
      command.limit,
    );
  }

  private async assertProfileExists(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }
}
