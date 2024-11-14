import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { User } from 'src/core/models';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry/create-or-update-log-entry.usecase';

export type ShareLogEntriesCommand = {
  ownerId: string;
};

@Injectable()
export class ShareLogEntriesUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
  ) {}

  async execute(command: ShareLogEntriesCommand) {
    const user = await this.assertUserExists(command.ownerId);

    await this.userRepository.update({
      ...user,
      logEntriesShared: true,
    } as User);

    await this.createShareLogEntry(command.ownerId);
  }

  private async assertUserExists(userId: string) {
    const user = await this.userRepository.ofId(userId);
    if (!user) {
      throw new RessourceDoesNotExist('User does not exist');
    }

    return user;
  }

  private async createShareLogEntry(userId: string) {
    await this.createOrUpdateLogEntryUsecase.execute({
      type: LogEntryType.SHARING_LOGS,
      ownerId: userId,
      metadata: {},
    });
  }
}
