import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { ProfileIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import { Profile, Tandem, TandemStatus } from 'src/core/models';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';

export type CreateTandemCommand = {
  id: string;
  profiles: string[];
  status: TandemStatus;
};

@Injectable()
export class CreateTandemUsecase {
  private readonly logger = new Logger(CreateTandemUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
  ) {}

  async execute(command: CreateTandemCommand): Promise<void> {
    const profiles = await Promise.all(
      command.profiles.map((id) => this.tryToFindProfile(id)),
    );

    await Promise.all(
      profiles.map((profile) => this.assertProfileIsNotInActiveTandem(profile)),
    );

    const tandem = Tandem.create({
      id: command.id,
      profiles: profiles,
      status: command.status,
    });

    await this.tandemsRepository.save(tandem);
  }

  private async tryToFindProfile(id: string) {
    const profile = await this.profilesRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    return profile;
  }

  private async assertProfileIsNotInActiveTandem(
    profile: Profile,
  ): Promise<void> {
    const hasActiveTandem = await this.tandemsRepository.hasActiveTandem(
      profile.id,
    );

    if (hasActiveTandem) {
      throw new ProfileIsAlreadyInActiveTandemError(profile.id);
    }
  }
}
