import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';

export class DeleteUserCommand {
  id: string;
}

@Injectable()
export class DeleteUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(command: DeleteUserCommand) {
    const instance = await this.userRepository.ofId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    if (instance.avatar) {
      await this.storage.deleteFile(
        instance.avatar.bucket,
        instance.avatar.name,
      );
    }

    return this.userRepository.delete(command.id);
  }
}
