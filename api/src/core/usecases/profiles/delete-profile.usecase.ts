import { Inject, Injectable } from '@nestjs/common';
import { ProfileDoesNotExist } from '../../errors/RessourceDoesNotExist';
import { ProfileRepository } from '../../ports/profile.repository';
import { PROFILE_REPOSITORY } from '../../../providers/providers.module';

export type DeleteProfileCommand = {
  id: string;
};

@Injectable()
export class DeleteProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const profile = await this.profileRepository.ofId(command.id);

    if (!profile) {
      throw ProfileDoesNotExist.withIdOf(command.id);
    }

    await this.profileRepository.delete(profile);
  }
}
