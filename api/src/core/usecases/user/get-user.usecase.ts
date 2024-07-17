import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

@Injectable()
export class GetUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, shouldThrow: boolean = true) {
    const instance = await this.userRepository.ofId(id);

    if (!instance && shouldThrow) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
