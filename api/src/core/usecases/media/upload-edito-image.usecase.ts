import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject } from 'src/core/models';
import { Edito } from 'src/core/models/edito.model';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from 'src/core/ports/media-object.repository';
import {
  File,
  StorageInterface,
  STORAGE_INTERFACE,
} from '../../ports/storage.interface';

export class UploadEditoImageCommand {
  id: string;
  file: File;
}

@Injectable()
export class UploadEditoImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
  ) {}

  async execute(command: UploadEditoImageCommand) {
    const edito = await this.tryToFindEdito(command.id);
    const previousImage = await this.tryToFindTheImageOfEdito(edito);
    if (edito) {
      await this.deletePreviousEditoImage(previousImage);
    }

    const image = await this.upload(edito, command.file);

    const url = this.storageInterface.temporaryUrl(
      image.bucket,
      image.name,
      60 * 60 * 24,
    );

    return url;
  }

  private async tryToFindEdito(id: string): Promise<Edito> {
    const instance = await this.editoRepository.findById(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheImageOfEdito(edito: Edito): Promise<MediaObject | null> {
    return this.mediaObjectRepository.findOne(
      `${edito.university.id}/${edito.id}`,
    );
  }

  private async upload(
    edito: Edito,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.generate(
      file,
      'edito',
      `${edito.university.id}/${edito.id}`,
    );

    await this.storageInterface.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveEditoImage(edito, image);

    return image;
  }

  private async deletePreviousEditoImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
