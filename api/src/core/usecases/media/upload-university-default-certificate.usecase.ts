import { Inject, Injectable } from '@nestjs/common';
import { MediaObject, University } from 'src/core/models';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { v4 } from 'uuid';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadUniversityDefaultCertificateCommand {
  id: string;
  file: File;
}

@Injectable()
export class UploadUniversityDefaultCertificateUsecase {
  #name = 'certifates/unversities/Modèle de certificat - {universityName}.pdf';
  #bucket = 'assets';

  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UploadUniversityDefaultCertificateCommand) {
    const university = await this.universityRepository.ofId(command.id);
    const previousFile = await this.tryToFindTheFile(university);

    await this.deletePreviousFile(university, previousFile);

    return this.upload(university, command.file);
  }

  private getFileName(universityName: string) {
    return this.#name.replace('{universityName}', universityName);
  }

  private tryToFindTheFile(
    university: University,
  ): Promise<MediaObject | null> {
    return university.defaultCertificateFile?.id
      ? this.mediaObjectRepository.findOne(university.defaultCertificateFile.id)
      : null;
  }

  private async upload(
    university: University,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const mediaObject = new MediaObject({
      id: v4(),
      name: this.getFileName(university.name),
      bucket: this.#bucket,
      mimetype: file.mimetype,
      size: file.size,
    });
    await this.storage.write(mediaObject.bucket, mediaObject.name, file);
    await this.mediaObjectRepository.saveUniversityDefaultCertificate(
      university,
      mediaObject,
    );

    return mediaObject;
  }

  private async deletePreviousFile(
    university: University,
    mediaObject: MediaObject | null,
  ) {
    await this.storage.delete(this.#bucket, this.getFileName(university.name));
    if (!mediaObject) return;
    await this.mediaObjectRepository.remove(mediaObject.id);
  }
}
