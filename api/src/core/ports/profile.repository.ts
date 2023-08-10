import { Collection, SortOrderType, StringFilter } from '@app/common';
import { Profile } from '../models';
import { ProfileQuerySortKey } from 'src/api/dtos';

export const PROFILE_REPOSITORY = 'profile.repository';

export type MaxTandemsCountAndLanguageProps = {
  tandemsCount: number;
  nativeLanguage: {
    not: string;
  };
};

export type GetProfilesUsableForTandemsGenerationProps = {
  maxTandemPerProfile: number;
  universityIds: string[];
};

export interface ProfileRepository {
  ofId: (id: string) => Promise<Profile | null>;

  ofUser: (userId: string) => Promise<Profile | null>;

  getProfilesUsableForTandemsGeneration: (
    props: GetProfilesUsableForTandemsGenerationProps,
  ) => Promise<Profile[]>;

  whereMaxTandemsCountAndLanguage: (
    props: MaxTandemsCountAndLanguageProps,
  ) => Promise<Profile[]>;

  create: (profile: Profile) => Promise<void>;

  update: (profile: Profile) => Promise<void>;

  findAll: (
    offset?: number,
    limit?: number,
    orderBy?: SortOrderType<ProfileQuerySortKey>,
    where?: { email?: StringFilter },
  ) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
