import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { MediaObject, User } from 'src/core/models';
import { RessourceDoesNotExist } from 'src/core/errors';

export class UploadAvatarCommand {
  userId: string;
  file: File;
}

@Injectable()
export class UploadAvatarUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UploadAvatarCommand) {
    const user = await this.tryToFindTheUserOfId(command.userId);
    const previousImage = user.avatar;

    await this.deletePreviousAvatar(previousImage);
    const avatar = await this.upload(user, command.file);

    return avatar;
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const instance = await this.userRepository.ofId(id);
    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }

  private async upload(
    user: User,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.image(file);
    await this.storageInterface.uploadFile(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveAvatar(user, image);

    return image;
  }

  private async deletePreviousAvatar(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.deleteFile(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
