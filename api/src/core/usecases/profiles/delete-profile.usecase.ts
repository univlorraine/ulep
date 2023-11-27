import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage, Profile } from 'src/core/models';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';

export class DeleteProfileCommand {
  id: string;
}

@Injectable()
export class DeleteProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const profile = await this.profilesRepository.ofId(command.id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }
    await deleteTandemsForLearningLanguages(profile, this.tandemRepository);
    await this.profilesRepository.delete(profile);
  }
}

const deleteTandemsForLearningLanguages = async (
  profile: Profile,
  tandemRepository: TandemRepository,
) => {
  const deletePromises = profile.learningLanguages.map(
    async (learningLanguage: LearningLanguage) => {
      const tandem = await tandemRepository.getTandemForLearningLanguage(
        learningLanguage.id,
      );
      if (tandem) {
        await tandemRepository.delete(tandem.id);
      }
    },
  );

  await Promise.all(deletePromises);
};
