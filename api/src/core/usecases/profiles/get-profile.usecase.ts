import { Inject, Injectable } from '@nestjs/common';
import { ProfileDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { ProfileRepository } from '../../ports/profile.repository';
import { PROFILE_REPOSITORY } from '../../../providers/providers.module';

export type GetProfileCommand = {
  id: string;
};

@Injectable()
export class GetProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: GetProfileCommand) {
    const profile = await this.profileRepository.ofId(command.id);

    if (!profile) {
      throw ProfileDoesNotExist.withIdOf(command.id);
    }

    return profile;
  }
}
