import { Inject, Injectable } from '@nestjs/common';
import { ProfileDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { CEFRLevel, Profile } from '../../models/profile';
import { ProfileRepository } from '../../ports/profile.repository';
import { PROFILE_REPOSITORY } from '../../../providers/providers.module';

export type UpdateProfileCommand = {
  id: string;
  proficiencyLevel: CEFRLevel;
};

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const profile = await this.tryToFindTheProfilerOfId(command.id);

    if (command.proficiencyLevel == profile.languages.learningLanguageLevel) {
      return profile;
    }

    profile.languages = {
      ...profile.languages,
      learningLanguageLevel: command.proficiencyLevel,
    };

    await this.profileRepository.update(profile);

    return profile;
  }

  private async tryToFindTheProfilerOfId(id: string): Promise<Profile> {
    const instance = await this.profileRepository.ofId(id);
    if (!instance) {
      throw ProfileDoesNotExist.withIdOf(id);
    }
    return instance;
  }
}
