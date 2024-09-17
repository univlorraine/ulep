import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject, User } from 'src/core/models';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

export class UploadAvatarCommand {
  userId: string;
  file: File;
}

@Injectable()
export class UploadAvatarUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UploadAvatarCommand) {
    const user = await this.tryToFindTheUserOfId(command.userId);

    const previousImage = await this.tryToFindTheAvatarOfUser(user);

    await this.tryToDeletePreviousAvatar(previousImage);

    const avatar = await this.upload(user, command.file);

    return avatar;
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const instance = await this.userRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheAvatarOfUser(user: User): Promise<MediaObject | null> {
    return this.mediaObjectRepository.findOne(user.id);
  }

  private async upload(
    user: User,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.image(
      file,
      MediaObject.getDefaultBucket(),
      user.id,
    );
    await this.storage.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveAvatar(user, image);

    return image;
  }

  private async tryToDeletePreviousAvatar(image: MediaObject | null) {
    if (!image) return;
    await this.storage.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
