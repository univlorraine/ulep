import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';

export class GetTandemsForProfileCommand {
  profile: string;
}

@Injectable()
export class GetTandemsForProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: GetTandemsForProfileCommand) {
    const profile = await this.profileRepository.ofId(command.profile);
    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    const tandems = await this.tandemRepository.getTandemsForProfile(
      profile.id,
    );

    return tandems;
  }
}
