import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject, University } from 'src/core/models';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadUniversityImageCommand {
  id: string;
  file: File;
}

@Injectable()
export class UploadUniversityImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UploadUniversityImageCommand) {
    const university = await this.tryToFindUniversity(command.id);
    const previousImage = await this.tryToFindTheImageOfUniversity(university);
    if (previousImage) {
      await this.deletePreviousObjectiveImage(previousImage);
    }

    const image = await this.upload(university, command.file);

    return image;
  }

  private async tryToFindUniversity(id: string): Promise<University> {
    const instance = await this.universityRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheImageOfUniversity(
    university: University,
  ): Promise<MediaObject | null> {
    return university.logo?.id
      ? this.mediaObjectRepository.findOne(university.logo.id)
      : null;
  }

  private async upload(
    university: University,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
<<<<<<< HEAD
    const image = MediaObject.generate(file, 'university');
    await this.storageInterface.write(image.bucket, image.name, file);
=======
    const image = MediaObject.image(file, 'university');
    await this.storage.write(image.bucket, image.name, file);
>>>>>>> develop
    await this.mediaObjectRepository.saveUniversityImage(university, image);

    return image;
  }

  private async deletePreviousObjectiveImage(image: MediaObject | null) {
    if (!image) return;
    await this.storage.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
