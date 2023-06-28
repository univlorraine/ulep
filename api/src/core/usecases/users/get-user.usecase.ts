import { Inject, Injectable } from '@nestjs/common';
import { UserDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';
import { UserRepository } from 'src/core/ports/user.repository';
import { USER_REPOSITORY } from 'src/providers/providers.module';

export type GetUserCommand = {
  id: string;
};

@Injectable()
export class GetUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetUserCommand) {
    const user = await this.userRepository.ofId(command.id);

    if (!user) {
      throw UserDoesNotExist.withIdOf(command.id);
    }

    return user;
  }
}
