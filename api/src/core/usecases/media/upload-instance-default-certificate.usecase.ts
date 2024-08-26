import { Inject, Injectable } from '@nestjs/common';
import { MediaObject } from 'src/core/models';
import { Instance } from 'src/core/models/Instance.model';
import {
  INSTANCE_REPOSITORY,
  InstanceRepository,
} from 'src/core/ports/instance.repository';
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

export class UploadInstanceDefaultCertificateCommand {
  file: File;
}

@Injectable()
export class UploadInstanceDefaultCertificateUsecase {
  #name = 'certifates/instance/Modèle de certificat.pdf';
  #bucket = 'assets';

  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(INSTANCE_REPOSITORY)
    private readonly instanceRepository: InstanceRepository,
  ) {}

  async execute(command: UploadInstanceDefaultCertificateCommand) {
    const instance = await this.instanceRepository.getInstance();
    const previousFile = await this.tryToFindTheFile(instance);

    await this.deletePreviousFile(previousFile);

    return this.upload(instance, command.file);
  }

  private tryToFindTheFile(instance: Instance): Promise<MediaObject | null> {
    return instance.defaultCertificateFile?.id
      ? this.mediaObjectRepository.findOne(instance.defaultCertificateFile.id)
      : null;
  }

  private async upload(
    instance: Instance,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const mediaObject = new MediaObject({
      id: v4(),
      name: this.#name,
      bucket: this.#bucket,
      mimetype: file.mimetype,
      size: file.size,
    });
    await this.storage.write(mediaObject.bucket, mediaObject.name, file);
    await this.mediaObjectRepository.saveInstanceDefaultCertificate(
      instance,
      mediaObject,
    );

    return mediaObject;
  }

  private async deletePreviousFile(mediaObject: MediaObject | null) {
    await this.storage.delete(this.#bucket, this.#name);
    if (!mediaObject) return;
    await this.mediaObjectRepository.remove(mediaObject.id);
  }
}
