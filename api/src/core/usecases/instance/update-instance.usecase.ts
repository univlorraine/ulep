import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EditoMandatoryTranslations } from 'src/core/models/Instance.model';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';
import {
  InstanceRepository,
  INSTANCE_REPOSITORY,
} from 'src/core/ports/instance.repository';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';

export class UpdateInstanceCommand {
  name?: string;
  email?: string;
  cguUrl?: string;
  ressourceUrl?: string;
  confidentialityUrl?: string;
  primaryColor?: string;
  primaryBackgroundColor?: string;
  primaryDarkColor?: string;
  secondaryColor?: string;
  secondaryBackgroundColor?: string;
  secondaryDarkColor?: string;
  editoMandatoryTranslations?: EditoMandatoryTranslations[];
  editoCentralUniversityTranslations?: string[];
}

@Injectable()
export class UpdateInstanceUsecase {
  constructor(
    @Inject(INSTANCE_REPOSITORY)
    private readonly instanceRepository: InstanceRepository,
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateInstanceCommand) {
    const instance = await this.instanceRepository.getInstance();

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const newInstance = await this.instanceRepository.update({
      id: instance.id,
      ...command,
    });

    // Update the central university edito translations
    const centralUniversity =
      await this.universityRepository.findUniversityCentral();

    const edito = await this.editoRepository.findByUniversityId(
      centralUniversity.id,
    );

    const newTranslations = command.editoCentralUniversityTranslations
      ? command.editoCentralUniversityTranslations.map((translation) => {
          const existingTranslation = edito.translations.find(
            (t) => t.languageCode === translation,
          );
          return {
            languageCode: translation,
            content: existingTranslation?.content || '',
          };
        })
      : [];

    newTranslations.push(
      edito.translations.find((t) => t.languageCode === 'en'),
    );

    await this.editoRepository.update({
      id: edito.id,
      content: edito.content,
      languageCode: edito.languageCode,
      translations: newTranslations,
    });

    return newInstance;
  }
}
