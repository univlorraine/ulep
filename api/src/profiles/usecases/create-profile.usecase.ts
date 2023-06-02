import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../domain/profiles.repository';
import Profile from '../domain/profile';

export class CreateProfileCommand {
  email: string;
}

@Injectable()
export class CreateProfileUsecase {
  constructor(
    @Inject('profile.repository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute({ email }: CreateProfileCommand): Promise<void> {
    await this.profileRepository.createProfile(new Profile(email));
  }
}
