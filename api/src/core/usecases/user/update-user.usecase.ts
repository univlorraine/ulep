import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { UserStatus } from 'src/core/models';

export class UpdateUserCommand {
  id: string;
  status?: UserStatus;
}

@Injectable()
export class UpdateUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    console.log(command);
    const instance = await this.userRepository.ofId(command.id);
    console.log(instance);
    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.userRepository.update({
      ...instance,
      status: command.status,
    });
  }
}
