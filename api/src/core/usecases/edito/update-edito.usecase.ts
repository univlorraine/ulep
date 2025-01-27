import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EditoTranslation } from 'src/core/models/edito.model';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';

export type UpdateEditoCommand = {
  id: string;
  languageCode: string;
  content: string;
  translations?: EditoTranslation[];
};

@Injectable()
export class UpdateEditoUsecase {
  constructor(
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
  ) {}

  async execute(command: UpdateEditoCommand) {
    await this.assertEditoExists(command.id);

    return this.editoRepository.update({
      id: command.id,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations ?? [],
    });
  }

  private async assertEditoExists(id: string) {
    const edito = await this.editoRepository.findById(id);

    if (!edito) {
      throw new RessourceDoesNotExist('Edito does not exist');
    }

    return edito;
  }
}
