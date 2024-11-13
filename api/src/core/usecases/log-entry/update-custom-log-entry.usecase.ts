import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LogEntryCustomEntry } from 'src/core/models/log-entry.model';
import {
  LogEntryRepository,
  LOG_ENTRY_REPOSITORY,
} from 'src/core/ports/log-entry.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';

export type UpdateCustomLogEntryCommand = {
  id: string;
  content: string;
  ownerId: string;
};

@Injectable()
export class UpdateCustomLogEntryUsecase {
  constructor(
    @Inject(LOG_ENTRY_REPOSITORY)
    private readonly logEntryRepository: LogEntryRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: UpdateCustomLogEntryCommand) {
    await this.assertProfileExists(command.ownerId);
    await this.assertLogEntryExists(command.id);

    return this.logEntryRepository.update({
      id: command.id,
      metadata: {
        content: command.content,
      },
    });
  }

  private async assertProfileExists(userId: string) {
    const profile = await this.profileRepository.ofUser(userId);
    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private async assertLogEntryExists(id: string) {
    const logEntry = await this.logEntryRepository.ofId(id);
    if (!logEntry) {
      throw new RessourceDoesNotExist('Log entry does not exist');
    }

    if (!(logEntry instanceof LogEntryCustomEntry)) {
      throw new UnauthorizedException('Only custom log entries can be updated');
    }
  }
}
