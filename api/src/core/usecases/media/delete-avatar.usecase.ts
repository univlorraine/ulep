import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { MediaObject, User } from 'src/core/models';
import { UnauthorizedOperation } from 'src/core/errors';

export class DeleteAvatarCommand {
  userId: string;
}

@Injectable()
export class DeleteAvatarUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteAvatarCommand) {
    const user = await this.tryToFindTheUserOfId(command.userId);

    const previousImage = await this.tryToFindTheAvatarOfUser(user);
    await this.deletePreviousAvatar(previousImage);
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const instance = await this.userRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheAvatarOfUser(user: User): Promise<MediaObject | null> {
    return this.mediaObjectRepository.avatarOfUser(user.id);
  }

  private async deletePreviousAvatar(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.deleteFile(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
