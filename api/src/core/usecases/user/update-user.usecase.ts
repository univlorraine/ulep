import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { User, UserStatus } from 'src/core/models';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';

export class UpdateUserCommand {
  id: string;
  status?: UserStatus;
  acceptsEmail?: boolean;
}

@Injectable()
export class UpdateUserUsecase {
  private logger = new Logger('UpsateUserUsecase');
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    const user = await this.userRepository.ofId(command.id);
    if (!user) {
      throw new RessourceDoesNotExist();
    }

    if (
      user.status !== UserStatus.BANNED &&
      command.status === UserStatus.BANNED
    ) {
      this.logger.verbose(`User ${user.id} has been banned`);

      await this.tandemRepository.disableTandemsForUser(user.id);
    }

    return this.userRepository.update(
      new User({
        ...user,
        status: command.status,
        acceptsEmail: command.acceptsEmail,
      }),
    );
  }
}
