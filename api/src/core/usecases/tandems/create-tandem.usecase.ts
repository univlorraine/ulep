import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProfileDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';
import { ProfileIsAlreadyInActiveTandemError } from 'src/core/errors/TandemExceptions';
import { Profile } from 'src/core/models/profile';
import { Tandem } from 'src/core/models/tandem';
import { ProfileRepository } from 'src/core/ports/profile.repository';
import { TandemsRepository } from 'src/core/ports/tandems.repository';
import {
  PROFILE_REPOSITORY,
  TANDEM_REPOSITORY,
} from 'src/providers/providers.module';

export type CreateTandemCommand = {
  id: string;
  profiles: string[];
  status: 'active' | 'inactive';
};

@Injectable()
export class CreateTandemUsecase {
  private readonly logger = new Logger(CreateTandemUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemsRepository,
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
      throw ProfileDoesNotExist.withIdOf(id);
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
