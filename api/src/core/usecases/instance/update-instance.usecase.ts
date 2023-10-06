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
      id: instance.id,
      name: command.name || instance.name,
      email: command.email || instance.email,
      cguUrl: command.cguUrl || instance.cguUrl,
      confidentialityUrl:
        command.confidentialityUrl || instance.confidentialityUrl,
      ressourceUrl: command.ressourceUrl || instance.ressourceUrl,
      primaryColor: command.primaryColor || instance.primaryColor,
      primaryBackgroundColor:
        command.primaryBackgroundColor || instance.primaryBackgroundColor,
      primaryDarkColor: command.primaryDarkColor || instance.primaryDarkColor,
      secondaryColor: command.secondaryColor || instance.secondaryColor,
      secondaryBackgroundColor:
        command.secondaryBackgroundColor || instance.secondaryBackgroundColor,
      secondaryDarkColor:
        command.secondaryDarkColor || instance.secondaryDarkColor,
    });

    await this.instanceRepository.update(newInstance);

    return newInstance;
  }
}
