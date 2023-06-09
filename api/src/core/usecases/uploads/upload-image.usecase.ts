import { Inject, Injectable } from '@nestjs/common';
import { MediaObjectRepository } from '../../ports/media-object.repository';
import { StorageService } from '../../ports/storage.service';
import MediaObject from '../../models/media-object';
import {
  MEDIA_OBJECT_REPOSITORY,
  STORAGE_SERVICE,
} from 'src/providers/providers.module';

@Injectable()
export class UploadImageUsecase {
  constructor(
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(file: Express.Multer.File) {
    const instance = MediaObject.image(file);

    await this.storageService.uploadFile(
      instance.getBucket(),
      instance.getName(),
      file,
    );

    await this.mediaObjectRepository.save(instance);

    return;
  }
}
