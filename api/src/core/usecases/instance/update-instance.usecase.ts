import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EditoMandatoryTranslations } from 'src/core/models/Instance.model';
import {
  InstanceRepository,
  INSTANCE_REPOSITORY,
} from 'src/core/ports/instance.repository';

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

    return newInstance;
  }
}
