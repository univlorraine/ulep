import { Inject, Injectable } from '@nestjs/common';
import { MediaObjectRepository } from '../../ports/media-object.repository';
import { StorageService } from '../../ports/storage.service';
import MediaObject from '../../models/media-object';
import {
  MEDIA_OBJECT_REPOSITORY,
  PROFILE_REPOSITORY,
  STORAGE_SERVICE,
} from 'src/providers/providers.module';
import { ProfileRepository } from 'src/core/ports/profile.repository';
import { Profile } from 'src/core/models/profile';
import { ProfileDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';

export class UploadImageCommand {
  profileId: string;
  file: Express.Multer.File;
}

@Injectable()
export class UploadImageUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(command: UploadImageCommand): Promise<MediaObject> {
    const profile = await this.tryToFindTheProfilerOfId(command.profileId);
    const previousImage = profile.avatar;
    profile.avatar = MediaObject.image(command.file);

    await this.uploadAvatar(profile, command.file);
    await this.deletePreviousImage(previousImage);

    return profile.avatar;
  }

  private async tryToFindTheProfilerOfId(id: string): Promise<Profile> {
    const instance = await this.profileRepository.ofId(id);
    if (!instance) {
      throw ProfileDoesNotExist.withIdOf(id);
    }
    return instance;
  }

  private async uploadAvatar(profile: Profile, file: Express.Multer.File) {
    const image = profile.avatar;
    await this.storageService.uploadFile(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveProfileImage(profile);
  }

  private async deletePreviousImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageService.deleteFile(image.bucket, image.name);
    await this.mediaObjectRepository.delete(image);
  }
}
