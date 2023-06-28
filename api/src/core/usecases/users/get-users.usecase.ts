import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../models/user';
import { Collection } from '../../../shared/types/collection';
import { UserRepository } from 'src/core/ports/user.repository';
import { USER_REPOSITORY } from 'src/providers/providers.module';

export class GetUsersCommand {
  page?: number;
  limit?: number;
}

@Injectable()
export class GetUsersUsecase {
  private readonly logger = new Logger(GetUsersUsecase.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetUsersCommand): Promise<Collection<User>> {
    const { page, limit } = command;
    const offset = (page - 1) * limit;
    const result = await this.userRepository.all(offset, limit);

    return result;
  }
}
