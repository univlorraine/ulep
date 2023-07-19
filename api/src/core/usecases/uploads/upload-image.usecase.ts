import { Inject, Injectable } from '@nestjs/common';
import { MediaObjectRepository } from '../../ports/media-object.repository';
import { StorageService } from '../../ports/storage.service';
import MediaObject from '../../models/media-object';
import {
  MEDIA_OBJECT_REPOSITORY,
  STORAGE_SERVICE,
  USER_REPOSITORY,
} from '../../../providers/providers.module';
import { UserDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { UserRepository } from 'src/core/ports/user.repository';
import { User } from 'src/core/models/user';

export class UploadImageCommand {
  userId: string;
  file: Express.Multer.File;
}

@Injectable()
export class UploadImageUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UploadImageCommand): Promise<MediaObject> {
    const user = await this.tryToFindTheUserOfId(command.userId);
    const previousImage = user.avatar;

    await this.deletePreviousImage(previousImage);
    const avatar = await this.uploadAvatar(user, command.file);

    return avatar;
  }

  private async tryToFindTheUserOfId(id: string): Promise<User> {
    const instance = await this.userRepository.ofId(id);
    if (!instance) {
      throw UserDoesNotExist.withIdOf(id);
    }

    return instance;
  }

  private async uploadAvatar(
    user: User,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.image(file);
    await this.storageService.uploadFile(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveAvatar(user, image);

    return image;
  }

  private async deletePreviousImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageService.deleteFile(image.bucket, image.name);
    await this.mediaObjectRepository.delete(image);
  }
}
