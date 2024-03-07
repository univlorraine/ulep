import { CountryRepository } from './../../ports/country.repository';
import { ProfileRepository } from '../../ports/profile.repository';
import { Inject } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  CountryCode,
  Profile,
  SuggestedLanguage,
  Tandem,
  TandemStatus,
  User,
} from 'src/core/models';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import { PROFILE_REPOSITORY } from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export interface UserPersonalData {
  user: User;
  userCountry: CountryCode;
  isBlacklisted: boolean;
  profile: Profile;
  languagesSuggestedByUser: SuggestedLanguage[];
  historizedTandems: HistorizedTandem[];
  activeTandems: Tandem[];
}

export class GetUserPersonalData {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(id: string): Promise<UserPersonalData> {
    const user = await this.userRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist();
    }
    const userCountry = await this.countryRepository.ofCode(user.country.code);

    const isBlacklisted = await this.userRepository.isBlacklisted(user.email);

    const profile = await this.profileRepository.ofUser(id);
    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    const languagesSuggestedByUser =
      await this.languageRepository.getLanguagesSuggestedByUser(user.id);

    const historizedTandems =
      await this.tandemRepository.getHistorizedTandemForUser(user.id);

    const activeTandems = (
      await this.tandemRepository.getTandemsForProfile(profile.id)
    ).filter((tandem) => tandem.status === TandemStatus.ACTIVE);

    return {
      user,
      userCountry,
      isBlacklisted,
      profile,
      languagesSuggestedByUser,
      historizedTandems,
      activeTandems,
    };
  }
}
