import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemsRepository,
} from 'src/core/ports/tandems.repository';

export class GetTandemsForProfileCommand {
  profile: string;
}

@Injectable()
export class GetTandemsForProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemsRepository,
  ) {}

  async execute(command: GetTandemsForProfileCommand) {
    const profile = await this.profileRepository.ofId(command.profile);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    const tandems = await this.tandemRepository.findWhere({
      profileId: profile.id,
    });

    return tandems;
  }
}
