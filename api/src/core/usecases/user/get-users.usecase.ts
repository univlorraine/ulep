import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

export class GetUsersCommand {
  page: number;
  limit: number;
}

@Injectable()
export class GetUsersUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetUsersCommand) {
    const { page, limit } = command;
    const offset = (page - 1) * limit;
    const result = await this.userRepository.findAll(offset, limit);

    return result;
  }
}
