import { Inject, Injectable } from '@nestjs/common';
import {
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';
import { UnauthorizedOperation } from 'src/core/errors';
import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { MediaObject } from 'src/core/models/media.model';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from 'src/core/ports/media-object.repository';

export class UploadAdminAvatarCommand {
  userId: string;
  file: File;
}

@Injectable()
export class UploadAdminAvatarUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: UploadAdminAvatarCommand) {
    const user = await this.tryToFindTheUserOfId(command.userId);

    const avatar = await this.upload(user, command.file);

    return avatar;
  }

  private async upload(
    user: UserRepresentation,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = new MediaObject({
      id: user.id,
      name: MediaObject.getFileName(user.id, file.mimetype),
      bucket: MediaObject.getDefaultBucket(),
      mimetype: file.mimetype,
      size: file.size,
    });

    await this.deletePreviousAvatar(image);
    await this.storageInterface.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveAdminAvatar(image);

    return image;
  }

  private async tryToFindTheUserOfId(id: string): Promise<UserRepresentation> {
    const instance = await this.keycloakClient.getUserById(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private async deletePreviousAvatar(image: MediaObject | null) {
    if (!image) return;
    if (await this.storageInterface.fileExists(image.bucket, image.name)) {
      await this.storageInterface.delete(image.bucket, image.name);
      await this.mediaObjectRepository.remove(image.id);
    }
  }
}
