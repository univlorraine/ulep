import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../domain/profiles.repository';
import Profile from '../domain/profile';
import { PROFILE_REPOSITORY } from 'src/providers/providers.module';

export class CreateProfileCommand {
  email: string;
}

@Injectable()
export class CreateProfileUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute({ email }: CreateProfileCommand): Promise<void> {
    await this.profileRepository.save(new Profile(email));
  }
}
