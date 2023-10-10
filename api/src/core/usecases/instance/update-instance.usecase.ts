import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Instance } from 'src/core/models/Instance.model';
import {
  INSTANCE_REPOSITORY,
  InstanceRepository,
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

    const newInstance = new Instance({
      ...instance,
      ...command,
    });

    await this.instanceRepository.update(newInstance);

    return newInstance;
  }
}
