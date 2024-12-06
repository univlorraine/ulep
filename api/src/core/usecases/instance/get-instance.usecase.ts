import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  INSTANCE_REPOSITORY,
  InstanceRepository,
} from 'src/core/ports/instance.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import {
  ASSETS_BUCKET,
  LOGO_FILENAME,
} from 'src/providers/storage/minio.storage';

@Injectable()
export class GetInstanceUsecase {
  constructor(
    @Inject(INSTANCE_REPOSITORY)
    private readonly instanceRepository: InstanceRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute() {
    const instance = await this.instanceRepository.getInstance();

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const instanceLogo = await this.storage.temporaryUrl(
      ASSETS_BUCKET,
      LOGO_FILENAME,
      60 * 60 * 24,
    );

    instance.logoURL = instanceLogo;

    return instance;
  }
}
