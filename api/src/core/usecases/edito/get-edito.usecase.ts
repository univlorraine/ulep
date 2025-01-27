import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Edito } from 'src/core/models/edito.model';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';

@Injectable()
export class GetEditoUsecase {
  constructor(
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(id: string): Promise<Edito> {
    const edito = await this.editoRepository.findById(id);

    if (!edito) {
      throw new RessourceDoesNotExist();
    }

    const imageURL = edito.image
      ? await this.storage.temporaryUrl(
          edito.image.bucket,
          edito.image.name,
          60 * 60 * 24,
        )
      : undefined;

    edito.imageURL = imageURL;

    return edito;
  }
}
