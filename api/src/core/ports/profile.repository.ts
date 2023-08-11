import { Collection, SortOrder, StringFilter } from '@app/common';
import { Profile } from '../models';

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

export interface ProfileQueryWhere {
  user: {
    country?: StringFilter;
    email?: StringFilter;
    firstname?: StringFilter;
    lastname?: StringFilter;
    role?: StringFilter;
    university?: StringFilter;
  };
  masteredLanguageCode?: string;
  nativeLanguageCode?: string;
}

export interface ProfileQueryOrderBy {
  field?: string;
  order: SortOrder;
}

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
    orderBy?: ProfileQueryOrderBy,
    where?: ProfileQueryWhere,
  ) => Promise<Collection<Profile>>;

  delete: (profile: Profile) => Promise<void>;
}
