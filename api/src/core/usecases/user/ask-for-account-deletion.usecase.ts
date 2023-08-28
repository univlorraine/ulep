import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export class AskForAccountDeletionCommand {
  user: string;
  reason?: string;
}

@Injectable()
export class AskForAccountDeletionUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: AskForAccountDeletionCommand) {
    const user = await this.userRepository.ofId(command.user);
    if (!user) {
      throw new UnauthorizedOperation();
    }

    await this.userRepository.update({
      ...user,
      deactivatedReason: command.reason,
    });

    return;
  }
}
