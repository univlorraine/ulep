import { ProfileRepository } from './../../ports/profile.repository';
import { Inject } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile, User } from 'src/core/models';
import { PROFILE_REPOSITORY } from 'src/core/ports/profile.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

// TODO(NOW+1): rename GetUserPersonalData

interface UserPersonalData {
  user: User;
  profile: Profile;
}

export class GetUserData {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(id: string): Promise<UserPersonalData> {
    const user = await this.userRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist();
    }

    // TODO(NOW)
    // Blacklist // OUI --> boolean si blacklisté
    // SuggestedLanguages, // OUI => les langages qu'il a suggéré --> code/langage/createdAt
    // Avatar --> URL si possible
    // Tandem history ---> ID des anciens tandems ? ID / date creation + langue apprentisage + quand fini ?

    const profile = await this.profileRepository.ofUser(id);
    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    return {
      user,
      profile,
    };
  }
}
