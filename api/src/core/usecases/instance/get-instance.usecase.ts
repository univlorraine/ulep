import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  INSTANCE_REPOSITORY,
  InstanceRepository,
} from 'src/core/ports/instance.repository';

@Injectable()
export class GetInstanceUsecase {
  constructor(
    @Inject(INSTANCE_REPOSITORY)
    private readonly instanceRepository: InstanceRepository,
  ) {}

  async execute() {
    const instance = await this.instanceRepository.getInstance();

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
